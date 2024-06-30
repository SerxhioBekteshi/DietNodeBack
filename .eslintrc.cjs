module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'sonarjs',
    'simple-import-sort',
    'react',
    'functional',
    'unused-imports',
    'formatjs',
  ],
  rules: {
    // Add or modify rules as needed
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off', // React 17 does not require import React from 'react'
    '@typescript-eslint/explicit-module-boundary-types': 'off', // May be redundant with React 18's automatic JSX import behavior
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables prefixed with _
    'no-console': 'error', // You might want to keep console.warn or console.error
    'no-debugger': 'warn', // Warn against debugger statements
    '@typescript-eslint/no-empty-function': 'error', // Allow empty functions, which might be placeholders for future implementations
    '@typescript-eslint/explicit-function-return-type': 'off', // Allow TypeScript's inference of return types
    '@typescript-eslint/no-explicit-any': 'error', // Avoid explicit `any` types
    '@typescript-eslint/no-non-null-assertion': 'off', // Avoid non-null assertion operator `!`
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false, // Allow `{}` as a type
          object: false, // Allow `object` as a type
        },
        extendDefaults: true,
      },
    ],
    'sonarjs/no-useless-catch': 'error',
    'sonarjs/no-all-duplicated-branches': 'error',
    'sonarjs/no-duplicate-string': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/no-gratuitous-expressions': 'error',
    'simple-import-sort/imports': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    'sonarjs/no-identical-conditions': 'error',
    'sonarjs/no-ignored-return': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/no-identical-expressions': 'error',
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
      },
    ],
    'react/no-unstable-nested-components': [
      'error',
      {
        allowAsProps: true,
      },
    ],
    'no-nested-ternary': 'error',
    'functional/prefer-immutable-types': 'off',
    'functional/no-loop-statements': 'error',
    'functional/no-let': 'off',

    'prefer-const': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'no-extra-boolean-cast': 'off',
    'object-shorthand': 'error',
    'react/jsx-boolean-value': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-useless-fragment': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    eqeqeq: 'error',
    'no-empty-pattern': 'error',
    'import/named': 'off',
    'import/no-named-as-default': 'off',
    'import/no-default-export': 'off',
    'import/first': 'error',
    'import/default': 'off',
    'import/newline-after-import': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'formatjs/no-offset': 'error',
    'formatjs/enforce-default-message': ['error', 'literal'],
    'formatjs/no-multiple-whitespaces': 'error',
    'formatjs/enforce-id': 'error',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};
