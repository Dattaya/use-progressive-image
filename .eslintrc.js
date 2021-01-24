require('@ohs/eslint-config/patch');

module.exports = {
  extends: [
    '@ohs/eslint-config',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
};
