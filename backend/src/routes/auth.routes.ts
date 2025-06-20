import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../bd/index';
import { usersTable } from '../../bd/schema';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/jwt';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
