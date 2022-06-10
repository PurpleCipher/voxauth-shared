/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    roots: [
        "<rootDir>/src"
    ],
    testEnvironment: "node",
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
};
