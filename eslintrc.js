module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true
  },
  extends: [
    'semistandard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  overrides: [
    {
      files: ['*.js', '*.spec.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    project: []
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    indent: 'off', // required as 'off' by @typescript-eslint/indent,
    '@typescript-eslint/no-explicit-any': 'off'
  },
  settings: {}
}
