import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations complete');
  } catch (error) {
    console.error('Error performing migrations:', error);
    throw error;
  }
}