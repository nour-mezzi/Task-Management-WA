import dotenv from 'dotenv';
// Import RequestHandler
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { v4 as uuidv4 } from 'uuid';

import { db } from './db';
import { tasksTable, usersTable, categoriesTable, DbTask, NewTask } from '../bd/schema';
import { eq, sql } from 'drizzle-orm';

dotenv.config();

const port = parseInt(process.env.PORT || '3001', 10);

interface CreateTaskRequestBody {
  title: string;
  category: string;
  description?: string | null;
  dueDate?: string | null;
}

interface PatchTaskRequestBody {
    title?: string;
    category?: string;
    description?: string | null;
    dueDate?: string | null;
    completed?: boolean;
}


/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique task ID.
 *         title:
 *           type: string
 *           description: The title of the task.
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the task.
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: The ID of the task's category.
 *         description:
 *           type: string
 *           description: Optional description of the task.
 *           nullable: true
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Optional due date in ISO 8601 format.
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the task was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the task was last updated.
 *
 *     CreateTaskPayload:
 *       type: object
 *       required:
 *         - title
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task.
 *           example: "Buy groceries"
 *         category:
 *           type: string
 *           description: The category name (e.g., "personal", "work"). Needs lookup to ID.
 *           example: "shopping"
 *         description:
 *           type: string
 *           description: Optional description.
 *           nullable: true
 *           example: "Milk, eggs, bread"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Optional due date.
 *           nullable: true
 *           example: "2024-01-01T10:00:00Z"
 *
 *     PatchTaskPayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: New title.
 *           example: "Buy groceries (urgent)"
 *         category:
 *           type: string
 *           description: New category name. Needs lookup to ID.
 *           example: "errands"
 *         description:
 *           type: string
 *           description: New description.
 *           nullable: true
 *           example: "Also get cheese"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: New due date.
 *           nullable: true
 *           example: "2024-01-01T12:00:00Z"
 *         completed:
 *           type: boolean
 *           description: New completion status.
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Description of the error.
 */

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
        schemas: {},
    }
  },
  apis: ['./src/server.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint message.
 *     responses:
 *       200:
 *         description: Success message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Task Backend Server is running!
 */
// No cast needed for sync handlers, but added next
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Task Backend Server is running!');
});

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks.
 *     description: Retrieves a list of all tasks.
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Added RequestHandler cast for async GET
app.get('/api/tasks', (async (req: Request, res: Response<DbTask[] | { message: string }>, next: NextFunction) => {
  console.log('GET /api/tasks requested');

  try {
      const allTasks = await db.select().from(tasksTable);
      res.json(allTasks);
  } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
  }
}) as RequestHandler<{}, DbTask[] | { message: string }, {}>); // Cast added

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task.
 *     description: Creates a new task associated with a user and category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskPayload'
 *     responses:
 *       201:
 *         description: The created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input (e.g., missing title or category, non-existent user/category).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Added RequestHandler cast for async POST
app.post('/api/tasks', (async (req: Request<{}, DbTask | { message: string }, CreateTaskRequestBody>, res: Response<DbTask | { message: string }>, next: NextFunction) => {
  console.log('POST /api/tasks requested');

  const { title, category, description, dueDate } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: 'Task title and category are required' });
  }

  try {
      const placeholderUserId = '00000000-0000-0000-0000-000000000001';
      const userExists = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.id, placeholderUserId)).limit(1);
       if (userExists.length === 0) {
            return res.status(400).json({ message: `User with ID ${placeholderUserId} not found. Please create a user first.` });
       }

      const categoryLookup = await db.select({ id: categoriesTable.id }).from(categoriesTable).where(eq(categoriesTable.name, category)).limit(1);

      if (categoryLookup.length === 0) {
          return res.status(400).json({ message: `Category "${category}" not found. Please create the category first.` });
      }

      const categoryId = categoryLookup[0].id;

      const newTaskData: NewTask = {
          title: title,
          completed: false,
          userId: placeholderUserId,
          categoryId: categoryId,
          description: description ?? null,
          dueDate: (dueDate === '' || dueDate === null) ? null : (dueDate ? new Date(dueDate) : null),
      };

      const insertedTasks = await db.insert(tasksTable)
          .values(newTaskData)
          .returning();

      const insertedTask = insertedTasks[0];

      if (!insertedTask) {
         console.error('Insert operation failed to return task.');
         return res.status(500).json({ message: 'Failed to create task' });
      }

      console.log('Task created:', insertedTask.id);

      res.status(201).json(insertedTask);

  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Failed to create task' });
  }
}) as RequestHandler<{}, DbTask | { message: string }, CreateTaskRequestBody>); // Cast added

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Partially update an existing task by ID.
 *     description: Send only the fields you want to change.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchTaskPayload'
 *     responses:
 *       200:
 *         description: The updated task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input (e.g., category name lookup failed).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Added RequestHandler cast for async PATCH
app.patch('/api/tasks/:id', (async (req: Request<{ id: string }, DbTask | { message: string }>, res: Response<DbTask | { message: string }>, next: NextFunction) => {
    const taskId = req.params.id;
    const updates = req.body;

    console.log(`PATCH /api/tasks/${taskId} requested`);

    try {
        const updatesForDb: Partial<NewTask> & { category?: string } = { ...updates };

        if (updates.dueDate !== undefined) {
             updatesForDb.dueDate = (updates.dueDate === '' || updates.dueDate === null) ? null : (updates.dueDate ? new Date(updates.dueDate) : null);
        }

        if (updates.description !== undefined) {
             updatesForDb.description = (updates.description === '' || updates.description === null) ? null : updates.description;
        }

        if (updates.category !== undefined) {
             const categoryLookup = await db.select({ id: categoriesTable.id }).from(categoriesTable).where(eq(categoriesTable.name, updates.category)).limit(1);

             if (categoryLookup.length === 0) {
                 return res.status(400).json({ message: `Category "${updates.category}" not found.` });
             }
             (updatesForDb as any).categoryId = categoryLookup[0].id;
             delete updatesForDb.category;
        }

        delete (updatesForDb as any).userId;

        const updatedTasks = await db.update(tasksTable)
            .set(updatesForDb)
            .where(eq(tasksTable.id, taskId))
            .returning();

        const updatedTask = updatedTasks[0];

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task patched:', updatedTask.id);
        res.json(updatedTask);

    } catch (error) {
        console.error('Error patching task:', error);
        res.status(500).json({ message: 'Failed to patch task' });
    }
}) as RequestHandler<{ id: string }, DbTask | { message: string }, PatchTaskRequestBody>); // Cast added

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID.
 *     description: Deletes a task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Added RequestHandler cast for async DELETE
app.delete('/api/tasks/:id', (async (req: Request<{ id: string }, { message: string }>, res: Response<{ message: string }>, next: NextFunction) => {
    const taskId = req.params.id;
    console.log(`DELETE /api/tasks/${taskId} requested`);

    try {
        const result = await db.delete(tasksTable)
            .where(eq(tasksTable.id, taskId))
            .returning({ id: tasksTable.id });

        if (result.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task deleted:', taskId);
        res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
}) as RequestHandler<{ id: string }, { message: string }, {}>); // Cast added

// No cast needed for sync handler, but added next
app.listen(port, () => {
  console.log(`Task Backend Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});