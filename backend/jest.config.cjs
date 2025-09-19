export default {
  testEnvironment: 'node',
  // .js dosyalarını ESM gibi ele al
  extensionsToTreatAsEsm: ['.js'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/scripts/**'
  ]
};