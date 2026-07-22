// Drizzle ORM - PostgreSQL connection
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const { POSTGRES_URL } = process.env;

if (!POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const pool = new pg.Pool({
  connectionString: POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
export { pool };
