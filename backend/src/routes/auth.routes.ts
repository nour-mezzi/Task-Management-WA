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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username }, // no password!
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        passwordHash,
      })
      .returning();

    const token = generateToken({ userId: newUser.id, email: newUser.email });

    return res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', async (req: Request, res: Response) => {
  console.log('➡️ POST /api/auth/login hit');

  try {
    const { email, password } = req.body;
    console.log('📩 Request body:', req.body);

    if (!email || !password) {
      console.warn('⚠️ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    console.log('🔍 User from DB:', user);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      console.warn('⚠️ Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    console.log('✅ Token generated');

    return res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });

  } catch (err) {
    console.error('❌ Login error:', err); // THIS is what we need to see
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
