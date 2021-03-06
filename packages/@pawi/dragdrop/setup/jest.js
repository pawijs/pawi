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
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/stories'],
  moduleNameMapper: {
    // What is here must reflect exactly what is in tsconfig
    '^app.cerebral$': '<rootDir>/src/app.cerebral',
    '^test$': '<rootDir>/src/test',
  },
  coverageThreshold: {
    global: {
      // Just to make sure we do not get worse
      statements: 48,
      branches: 20,
      lines: 47,
      functions: 38,
    },
  },
}
