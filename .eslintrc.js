module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    // 'import/resolver': {
    //   webpack: {
    //     config: `${__dirname}/internals/webpack/webpack.prod.babel.js`,
    //   },
    // },
    react: {
      version: 'detect',
    },
  },
}
