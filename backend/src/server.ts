import express from 'express';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import { logger } from './middleware/logger';
import { setupSwagger } from './swagger/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); 
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
