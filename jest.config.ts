import type { Config } from 'jest';
 
const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/?(*.)+(spec|test).(ts|tsx|js)'
  ],
  transform: {
    '^.+\.(ts|tsx|js|jsx)$' : ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
};
 
export default config;
