import fs from 'fs/promises';
import path from 'path';
import * as dbModule from './db'; // Import all exports from db.ts

const mockDbPath = path.join(process.cwd(), 'mock-db.json');

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

describe('db.ts', () => {
  const mockInitialData = {
    users: [
      { id: 1, email: 'test1@example.com', password: 'pass1' },
      { id: 2, email: 'test2@example.com', password: 'pass2' },
    ],
    polls: [
      { id: 1, question: 'Q1', options: [{ id: 1, text: 'O1', votes: 0 }], createdBy: 1 },
    ],
  };

  beforeEach(() => {
    // Reset mocks and provide initial data for each test
    (fs.readFile as jest.Mock).mockClear();
    (fs.writeFile as jest.Mock).mockClear();
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockInitialData));
  });

  describe('readDb', () => {
    it('should read and parse the database file', async () => {
      const data = await dbModule.readDb();
      expect(data).toEqual(mockInitialData);
      expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8');
    });

    it('should return default structure if file does not exist or is empty', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
      const data = await dbModule.readDb();
      expect(data).toEqual({ users: [], polls: [] });
    });
  });

  describe('writeDb', () => {
    it('should write and stringify the database file', async () => {
      const testData = { users: [{ id: 1, email: 'new@example.com' }], polls: [] };
      await dbModule.writeDb(testData);
      expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(testData, null, 2), 'utf-8');
    });
  });

  describe('addUser', () => {
    it('should add a new user to the database', async () => {
      const newUserInput = { email: 'new@example.com', password: 'newpass' };
      const addedUser = await dbModule.addUser(newUserInput);
      expect(addedUser).toEqual({ ...newUserInput, id: mockInitialData.users.length + 1 });
      // Verify writeDb was called with updated data
      const expectedDb = { ...mockInitialData, users: [...mockInitialData.users, addedUser] };
      expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(expectedDb, null, 2), 'utf-8');
    });
  });

  describe('findUserByEmail', () => {
    it('should find an existing user by email', async () => {
      const user = await dbModule.findUserByEmail('test1@example.com');
      expect(user).toEqual(mockInitialData.users[0]);
    });

    it('should return undefined if user not found', async () => {
      const user = await dbModule.findUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('getPolls', () => {
    it('should return all polls', async () => {
      const polls = await dbModule.getPolls();
      expect(polls).toEqual(mockInitialData.polls);
    });
  });

  describe('getPollById', () => {
    it('should return a poll by ID', async () => {
      const poll = await dbModule.getPollById(1);
      expect(poll).toEqual(mockInitialData.polls[0]);
    });

    it('should return undefined if poll not found', async () => {
      const poll = await dbModule.getPollById(999);
      expect(poll).toBeUndefined();
    });
  });

  describe('createPoll', () => {
    it('should create a new poll', async () => {
      const newPollInput = { question: 'New Q', options: [{ id: 1, text: 'Opt1', votes: 0 }], createdBy: 1 };
      const createdPoll = await dbModule.createPoll(newPollInput);
      expect(createdPoll).toEqual({ ...newPollInput, id: mockInitialData.polls.length + 1 });
      // Verify writeDb was called with updated data
      const expectedDb = { ...mockInitialData, polls: [...mockInitialData.polls, createdPoll] };
      expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(expectedDb, null, 2), 'utf-8');
    });
  });

  describe('voteOnPoll', () => {
    it('should increment votes for an option', async () => {
      const updatedPoll = await dbModule.voteOnPoll(1, 1);
      expect(updatedPoll?.options[0].votes).toBe(1);
      // Verify writeDb was called with updated data
      const expectedDb = JSON.parse(JSON.stringify(mockInitialData)); // Deep copy
      expectedDb.polls[0].options[0].votes = 1;
      expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(expectedDb, null, 2), 'utf-8');
    });

    it('should return undefined if poll not found', async () => {
      const updatedPoll = await dbModule.voteOnPoll(999, 1);
      expect(updatedPoll).toBeUndefined();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should return undefined if option not found', async () => {
      const updatedPoll = await dbModule.voteOnPoll(1, 999);
      expect(updatedPoll).toBeUndefined();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
