module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setupEnv.js"],
  maxWorkers: 1,
  testTimeout: 15000,
};
