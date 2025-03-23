import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import css from '@eslint/css';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    extends: [
      prettierRecommended,
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
    ],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          printWidth: 80,
        },
      ],
      indent: ['warn', 2, { SwitchCase: 1 }],
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],
      curly: 'warn',
      semi: 'warn',
      'no-unused-vars': 'warn',
      'no-unreachable': 'warn',
      'eol-last': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{css}'],
    plugins: {
      css,
    },
    language: 'css/css',
    rules: {
      'css/no-duplicate-imports': 'error',
      'css/no-invalid-color': 'error',
      'css/no-empty-block': 'warn',
      'css/no-extra-semicolon': 'error',
    },
  },
]);
