import { createPoll } from './actions';
import { revalidatePath } from 'next/cache';
 
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => {
      if (name === 'user') {
        return { value: JSON.stringify({ id: 'test-user-id', email: 'test@example.com' }) }; // Mock a logged-in user with valid JSON
      }
      return undefined;
    }),
  })),
}));
 
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
 
jest.mock('./db', () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(() => ([{ id: 1, question: "Test Question" }]))
      }))
    })),
    select: jest.fn(() => ({})),
  },
  createPoll: jest.fn(async ({ question, options, createdBy }) => {
    // Mock the behavior of dbCreatePoll, returning a simplified poll object
    return { id: 1, question, options, createdBy, createdAt: new Date() };
  }),
}));
 
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
 
describe('createPoll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  it('should create a poll successfully with valid data', async () => {
    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
    formData.append('option', 'Blue');
 
    const initialState = { error: null };
    const result = await createPoll(initialState, formData);
 
    expect(result).toBeUndefined();
    // expect(sql.query).toHaveBeenCalledTimes(3); 
    // expect(revalidatePath).toHaveBeenCalledWith('/polls/1'); // Expect revalidatePath with the specific poll ID
  });
 
  it('should return an error if question is missing', async () => {
    const formData = new FormData();
    formData.append('option', 'Red');
    formData.append('option', 'Blue');
 
    const initialState = { error: null };
    const result = await createPoll(initialState, formData);
 
    expect(result).toEqual({ error: 'Question and at least two options are required.' });
    // expect(sql.query).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
 
  it('should return an error if less than two options are provided', async () => {
    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
 
    const initialState = { error: null };
    const result = await createPoll(initialState, formData);
 
    expect(result).toEqual({ error: 'Question and at least two options are required.' });
    // expect(sql.query).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
 
  it('should return an error if any option is empty (after trimming)', async () => {
    const formData = new FormData();
    formData.append('question', 'What is your favorite color?');
    formData.append('option', 'Red');
    formData.append('option', '');
 
    const initialState = { error: null };
    const result = await createPoll(initialState, formData);
 
    expect(result).toEqual({ error: 'Question and at least two options are required.' });
    // expect(sql.query).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
