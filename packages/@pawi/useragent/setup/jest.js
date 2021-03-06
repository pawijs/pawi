module.exports = {
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '..',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '\\.test\\.tsx?$',
  testPathIgnorePatterns: ['/dist/', '<rootDir>/node_modules/', '/setup/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/stories',
    '<rootDir>/src/test.ts',
  ],
  moduleNameMapper: {
    // What is here must reflect exactly what is in tsconfig
    '^test$': '<rootDir>/src/test',
  },
  coverageThreshold: {
    global: {
      // Just to make sure we do not regress
      statements: 32,
      branches: 0,
      lines: 32,
      functions: 4,
    },
  },
}
