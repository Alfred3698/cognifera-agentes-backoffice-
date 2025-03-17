const { resolve } = require('path');

module.exports = {
  roots: ['<rootDir>/'],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist', 'mock-data/', 'node_modules/'],
  coveragePathIgnorePatterns: [
    '.schema.ts',
    'ormconfig.js',
    '.dto.ts',
    '.entity.ts',
    'utils/tranfomer-numeric.ts',
    'config/env/env.config.ts',
  ],
  moduleNameMapper: {
    '^@b-accel-logger/(.*)$': resolve(
      __dirname,
      './modules/b-accel-logger/src/$1',
    ),
    '^utils/(.*)$': resolve(__dirname, './utils/$1'),
    '^services/(.*)$': resolve(__dirname, './services/$1'),
    '^config/(.*)$': resolve(__dirname, './config/$1'),
  },

  coverageThreshold: {
    global: {
      statements: 90,
      branches: 55,
      functions: 80,
      lines: 90,
    },
  },
};
