import 'dotenv/config';
import express from 'express';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import { logger } from './middleware/logger';
import { authenticateJWT } from './middleware/auth'; // <-- add this
import { setupSwagger } from './swagger/swagger';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Protect task routes with JWT middleware
app.use('/api/tasks', authenticateJWT, taskRoutes);

// Auth routes stay public
app.use('/api/auth', authRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
