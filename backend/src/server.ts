import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  description: string | null;
  dueDate: string | null;
}

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


app.use(cors());
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
        schemas: {
            Task: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    completed: { type: 'boolean' },
                    category: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                },
            },
             CreateTaskPayload: {
                type: 'object',
                required: ['title', 'category'],
                 properties: {
                    title: { type: 'string' },
                    category: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            PatchTaskPayload: {
                type: 'object',
                 properties: {
                    title: { type: 'string' },
                    category: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                    completed: { type: 'boolean' },
                },
            },
        },
    },
  },
  apis: ['./src/server.ts'], // Ensure this points to the file containing the JSDoc comments
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


let tasks: Task[] = [
    { id: uuidv4(), title: 'Buy groceries', completed: false, category: 'shopping', description: 'Milk, eggs, bread', dueDate: null },
    { id: uuidv4(), title: 'Walk the dog', completed: true, category: 'personal', description: null, dueDate: null },
    { id: uuidv4(), title: 'Finish report', completed: false, category: 'work', description: 'Complete Q3 financial report', dueDate: '2023-12-31T23:59:59.999Z' },
];


// GET /api/tasks (No JSDoc comment added back for this one)
app.get('/api/tasks', ((req, res, next) => {
  console.log('GET /api/tasks requested');
  res.json(tasks);
}) as RequestHandler<{}, Task[], {}>);


// POST /api/tasks (No JSDoc comment added back for this one)
app.post('/api/tasks', ((req, res, next) => {
  console.log('POST /api/tasks requested with body:', req.body);

  const { title, category, description, dueDate } = req.body as CreateTaskRequestBody;

  if (!title || !category) {
    return res.status(400).json({ message: 'Task title and category are required' });
  }

  const newTask: Task = {
    id: uuidv4(),
    title: title,
    completed: false,
    category: category,
    description: description ?? null,
    dueDate: dueDate ?? null,
  };

  tasks.push(newTask);

  console.log('Task created:', newTask);

  res.status(201).json(newTask);
}) as RequestHandler<{}, Task | { message: string }, CreateTaskRequestBody>);


// PATCH /api/tasks/:id (No JSDoc comment added back for this one)
app.patch('/api/tasks/:id', ((req, res, next) => {
    const taskId = req.params.id;
    const updates = req.body as PatchTaskRequestBody;
    console.log(`PATCH /api/tasks/${taskId} requested with body:`, updates);

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        description: (updates.description === '' || updates.description === null) ? null : updates.description ?? tasks[taskIndex].description,
        dueDate: (updates.dueDate === '' || updates.dueDate === null) ? null : updates.dueDate ?? tasks[taskIndex].dueDate,
    };


    console.log('Task patched:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
}) as RequestHandler<{ id: string }, Task | { message: string }, PatchTaskRequestBody>);


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// DELETE /api/tasks/:id - JSDoc comment re-added above this line
app.delete('/api/tasks/:id', ((req, res, next) => {
    const taskId = req.params.id;
    console.log(`DELETE /api/tasks/${taskId} requested`);

    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task deleted:', taskId);
    res.json({ message: 'Task deleted successfully' });
}) as RequestHandler<{ id: string }, { message: string }, {}>);


// GET / (No JSDoc comment added back for this one)
app.get('/', ((req, res, next) => {
  res.send('Task Backend Server is running!');
}) as RequestHandler);


app.listen(port, () => {
  console.log(`Task Backend Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});