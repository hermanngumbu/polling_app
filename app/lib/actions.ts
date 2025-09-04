'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { addUser, findUserByEmail, createPoll as dbCreatePoll, voteOnPoll as dbVoteOnPoll } from './db';
import { revalidatePath } from 'next/cache';

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return { error: 'User with this email already exists.' };
  }

  // In a real app, you should hash the password here.
  await addUser({ email, password });

  return { success: true }; // Indicate success for redirection in client component
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const user = await findUserByEmail(email);

  // In a real app, you should compare hashed passwords.
  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  // Set a session cookie
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify({ id: user.id, email: user.email }), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { success: true }; // Indicate success for redirection in client component
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user');
  redirect('/login');
}

export async function createPoll(prevState: any, formData: FormData) {
  const question = formData.get('question') as string;
  const options = formData.getAll('option').map(o => o as string).filter(o => o.trim() !== '');

  if (!question || options.length < 2) {
    return { error: 'Question and at least two options are required.' };
  }

  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  if (!userCookie) {
    redirect('/login');
  }
  const user = JSON.parse(userCookie.value);

  const poll = await dbCreatePoll({
    question,
    options: options.map((text, i) => ({ id: i + 1, text, votes: 0 })),
    createdBy: user.id,
  });

  redirect(`/polls/${poll.id}`);
}

export async function submitVote(pollId: number, optionId: number) {
  await dbVoteOnPoll(pollId, optionId);
  revalidatePath(`/polls/${pollId}`);
}
