module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/tests/'],
  collectCoverageFrom: [
    '<rootDir>/src/handlers/**/**/*.ts',
    '<rootDir>/src/infra/**/repositories/*.ts',
    '<rootDir>/src/utils/*.ts',
  ],
  setupFiles: ["<rootDir>/setupTest.ts"],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60
    }
  }
};
