const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
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
  transform: tsjPreset.transform,
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
};
