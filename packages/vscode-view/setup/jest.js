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
    '<rootDir>/stories',
    // dist is imported by `@lucidogen/story`
    '<rootDir>/dist/',
  ],
  moduleNameMapper: {
    // What is here must reflect exactly what is in tsconfig
    '^test$': '<rootDir>/src/test',
  },
  haste: {
    // This option is needed or else globbing ignores <rootDir>/node_modules.
    providesModuleNodeModules: ['@lucidogen'],
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
