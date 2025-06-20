import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in your environment (.env) file.');
}

const EXPIRATION = '7d';

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: EXPIRATION });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET as string);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload: expected object');
  }
  return decoded;
}
