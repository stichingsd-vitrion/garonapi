import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import express from 'express';
import { todos } from './db/schema';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './db/migrate';

const app = express();
app.use(express.json());

// Create a new todo
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const result = await db.insert(todos).values({ title }).returning().get();
  res.json(result);
});

// Get all todos
app.get('/todos', async (req, res) => {
  const result = await db.select().from(todos).all();
  res.json(result);
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(todos).where(eq(todos.id, parseInt(id))).get();
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const result = await db.update(todos)
    .set({ title, completed })
    .where(eq(todos.id, parseInt(id)))
    .returning()
    .get();
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.delete(todos).where(eq(todos.id, parseInt(id))).returning().get();
  if (result) {
    res.json({ message: 'Todo deleted successfully' });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

const port = 3005;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});