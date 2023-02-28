module.exports = {
  preset: "ts-jest/presets/default-esm",
  testTimeout: 600000,
  // @sk-kitsune: we skip this test suite because it is not **pure**
  // (e.g. it requires environment setup, it requires network connection)
  modulePathIgnorePatterns: ["<rootDir>/modules/crypto"],
};
