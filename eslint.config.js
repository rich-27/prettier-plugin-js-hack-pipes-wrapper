import { defineConfig } from 'eslint/config';
import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from "globals";

export default defineConfig([
  {
    languageOptions: {
      parser: babelParser,
      globals: {
        ...globals.builtin,
        ...globals.node,
      }
    },
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['dist/**', 'vendor/**'],
  },
  eslintConfigPrettier,
]);
