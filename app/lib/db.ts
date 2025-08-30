import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export interface User {
  id: number;
  email: string;
  password?: string; // In a real app, this would be a hashed password
}

export interface Poll {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
  createdBy: number;
}

interface DbData {
  users: User[];
  polls: Poll[];
}

async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    return { users: [], polls: [] };
  }
}

async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// User functions
export async function getUsers(): Promise<User[]> {
  const db = await readDb();
  return db.users;
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  const db = await readDb();
  const newUser: User = { ...user, id: db.users.length + 1 };
  db.users.push(newUser);
  await writeDb(db);
  return newUser;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const db = await readDb();
    return db.users.find(u => u.email === email);
}

// Poll functions
export async function getPolls(): Promise<Poll[]> {
  const db = await readDb();
  return db.polls;
}

export async function getPollById(id: number): Promise<Poll | undefined> {
  const db = await readDb();
  return db.polls.find(p => p.id === id);
}

export async function createPoll(poll: Omit<Poll, 'id'>): Promise<Poll> {
  const db = await readDb();
  const newPoll: Poll = { ...poll, id: db.polls.length + 1 };
  db.polls.push(newPoll);
  await writeDb(db);
  return newPoll;
}

export async function voteOnPoll(pollId: number, optionId: number): Promise<Poll | undefined> {
    const db = await readDb();
    const poll = db.polls.find(p => p.id === pollId);
    if (poll) {
        const option = poll.options.find(o => o.id === optionId);
        if (option) {
            option.votes += 1;
            await writeDb(db);
            return poll;
        }
    }
    return undefined;
}