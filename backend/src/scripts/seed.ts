import { db } from '../../bd/index';
import { usersTable, categoriesTable, tasksTable } from '../../bd/schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding database...');

  // Insert a test user
  const passwordHash = await bcrypt.hash('test123', 10);
  const [user] = await db.insert(usersTable).values({
    username: 'nourmezzi',
    email: 'nour@example.com',
    passwordHash,
  }).returning();

  console.log(` Inserted user: ${user.username}`);

  // Insert test categories 
  const [catDev, catDesign, catStudy] = await db.insert(categoriesTable).values([
    {
      name: 'Development',
      description: 'Tasks related to coding and software development',
    },
    {
      name: 'Design',
      description: 'UI/UX and visual tasks',
    },
    {
      name: 'Study',
      description: 'Assignments and revision tasks',
    },
  ]).returning();

  console.log(`Inserted categories: Development, Design, Study`);

  // Insert tasks
  await db.insert(tasksTable).values([
    {
      title: 'Build login page',
      completed: false,
      userId: user.id,
      categoryId: catDev.id,
      description: 'Implement login form with validation',
      dueDate: new Date(Date.now() + 2 * 86400000), 
    },
    {
      title: 'Fix navbar bugs',
      completed: false,
      userId: user.id,
      categoryId: catDev.id,
      description: 'Navbar links not aligning correctly',
      dueDate: new Date(Date.now() + 4 * 86400000),
    },
    {
      title: 'Redesign task cards',
      completed: true,
      userId: user.id,
      categoryId: catDesign.id,
      description: 'Make task cards match brand colors',
      dueDate: new Date(Date.now() - 1 * 86400000),
    },
    {
      title: 'Revise software engineering notes',
      completed: false,
      userId: user.id,
      categoryId: catStudy.id,
      description: 'Go over UML and architecture slides',
      dueDate: new Date(Date.now() + 3 * 86400000),
    },
    {
      title: 'Write report introduction',
      completed: true,
      userId: user.id,
      categoryId: catStudy.id,
      description: 'First draft of the final report',
      dueDate: new Date(),
    },
  ]);

  console.log('Inserted 5 tasks.');

  console.log('Database seeded successfully.');
}

seed()
  .catch((err) => {
    console.error(' Seeding failed:', err);
  })
  .finally(() => process.exit());
