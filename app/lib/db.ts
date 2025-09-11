import { supabase } from './supabase';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password?: string; // Stored hashed in Supabase, but used for signup/login
}

export interface Poll {
  id: string;
  question: string;
  options: { id: number; text: string; votes: number }[];
  created_by: string; // Changed to match Supabase schema (foreign key to users.id)
}

// User functions
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('id, email');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data as User[];
}

export async function addUser(user: Omit<User, 'id'>): Promise<User | null> {
  const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : undefined;
  const { data, error } = await supabase.from('users').insert({ ...user, password: hashedPassword }).select();
  if (error) {
    console.error('Error adding user:', error);
    return null;
  }
  return data[0] as User;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase.from('users').select('id, email, password').eq('email', email).single();
  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error finding user by email:', error);
    return undefined;
  }
  return data ? (data as User) : undefined;
}

// Poll functions
export async function getPolls(): Promise<Poll[]> {
  const { data, error } = await supabase.from('polls').select('*');
  if (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
  return data as Poll[];
}

export async function getPollById(id: string): Promise<Poll | undefined> {
  const { data, error } = await supabase.from('polls').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching poll by id:', error);
    return undefined;
  }
  return data ? (data as Poll) : undefined;
}

export async function createPoll(poll: Omit<Poll, 'id'>): Promise<Poll | null> {
  const { data, error } = await supabase.from('polls').insert(poll).select();
  if (error) {
    console.error('Error creating poll:', error);
    return null;
  }
  return data[0] as Poll;
}

export async function voteOnPoll(pollId: string, optionId: number): Promise<Poll | undefined> {
  // First, get the current poll data
  const { data: currentPoll, error: fetchError } = await supabase
    .from('polls')
    .select('options')
    .eq('id', pollId)
    .single();

  if (fetchError || !currentPoll) {
    console.error('Error fetching poll for voting:', fetchError);
    return undefined;
  }

  const updatedOptions = currentPoll.options.map(option =>
    option.id === optionId ? { ...option, votes: option.votes + 1 } : option
  );

  const { data, error } = await supabase
    .from('polls')
    .update({ options: updatedOptions })
    .eq('id', pollId)
    .select();

  if (error) {
    console.error('Error voting on poll:', error);
    return undefined;
  }
  return data[0] as Poll;
}