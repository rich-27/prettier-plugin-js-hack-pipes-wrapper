import { defineConfig } from 'eslint/config';
import babelParser from '@babel/eslint-parser';
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
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['vendor/**'],
  },
  eslintConfigPrettier,
]);
