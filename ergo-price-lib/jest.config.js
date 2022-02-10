// const {
//   configs: { recommended: typescriptEslintRecommended },
// } = require("@typescript-eslint/eslint-plugin");
// const {
//   configs: { typescript: typescriptImports },
// } = require("eslint-plugin-import");

// module.exports = {
//   testEnvironment: "node",
//   collectCoverage: false,
//   roots: ["rootDir"],
//   transform: {
//     "^.+\\.(t|j)sx?$": "ts-jest",
//   },
//   transformIgnorePatterns: ["/node_modules/"],
//   testMatch: [
//     "<rootDir>/src/**/*.test.(ts|tsx|js)",
//     "<rootDir>/test/**/*.test.(ts|tsx|js)",
//   ],
//   moduleFileExtensions: ["ts", "tsx", "js", "json"],
//   watchPathIgnorePatterns: ["node_modules"],
//   overrides: [
//     {
//       files: ["**/*.ts", "**/*.tsx"],
//       parser: "@typescript-eslint/parser",
//       parserOptions: {
//         project: "./tsconfig.json",
//         ecmaVersion: 2018,
//         sourceType: "module",
//         ecmaFeatures: { jsx: true },
//       },
//       plugins: ["@typescript-eslint"],
//       ...typescriptImports,
//       rules: {
//         ...typescriptEslintRecommended.rules,
//         "import/extensions": ["error", "ignorPackages", { ts: "never" }],
//       },
//     },
//   ],
// };

// module.exports = {
//   extends: "airbnb-typescript-prettier",
// };

// module.exports = {
//   root: true,
//   extends: "airbnb-typescript/base",
//   plugins: ["import", "prettier"],
//   parserOptions: {
//     project: "./tsconfig.eslint.json",
//   },
// };
