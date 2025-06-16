import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('FATAL ERROR: Database environment variables are not set!');
     process.env.DB_HOST = process.env.DB_HOST || 'localhost';
     process.env.DB_PORT = process.env.DB_PORT || '5432';
     process.env.DB_USER = process.env.DB_USER || 'test';
     process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
     process.env.DB_NAME = process.env.DB_NAME || 'test';
}

const client = new Client({
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

async function connectDb() {
    try {
        await client.connect();
        console.log('Database client connected successfully.');
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
}

connectDb();

export const db = drizzle(client, { schema });