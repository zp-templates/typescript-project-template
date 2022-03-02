require('dotenv').config({ path: '__tests__/.env.tests' });

module.exports = {
  preset: 'ts-jest',
  testRegex: '/[A-Za-z0-9_-]+\\.(test)\\.[jt]sx?$',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['src/**/*.{js,ts,ts}'],
  moduleNameMapper: {
    '__tests__/(.*)': ['<rootDir>/__tests__/$1']
  }
};
