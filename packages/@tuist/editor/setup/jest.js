module.exports = {
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '..',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'v2.*\\.test\\.tsx?$',
  testPathIgnorePatterns: ['/dist/', '<rootDir>/node_modules/', '/setup/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/stories'],
  moduleNameMapper: {
    // What is here must reflect exactly what is in tsconfig
    '^test$': '<rootDir>/src/test',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['<rootDir>/setup/crypto.ts'],
}
