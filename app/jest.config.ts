import tsconfig from './tsconfig.paths.json';
import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  displayName: 'Api',
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  maxWorkers: '50%',
  watchPathIgnorePatterns: ['node_modules'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/@types/*',
    '!src/domain/repositories/**/*.ts', // ignore all repositories in domain (should be all interfaces)
    '!src/**/*_{dto,entity,type,interface}.ts', // ignore files ending with dto, entity and type (should be all types)
    '!src/**/type.ts', // any files called type (should be a definition type)
    '!src/**/*.d.ts', // ignore files ending with .d.ts (should be all definition types)
    '!src/config.ts', // ignore application config
    '!src/index.ts', // ignore index testing
    '!src/server.ts', // ignore server bootstrap
    '!src/data/database/prisma/index.ts', //ignore prisma instance invoke
  ],
  transformIgnorePatterns: ['node_modules'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '.(ts|tsx)': [
      'ts-jest',
      { compiler: 'ttypescript', isolatedModules: true },
    ],
  },
  setupFiles: ['<rootDir>jest.setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
};
