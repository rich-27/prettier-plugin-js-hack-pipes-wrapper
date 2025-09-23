import { defineConfig } from 'eslint/config';
import babelParser from '@babel/eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    ignores: ['vendor/**'],
  },
  eslintConfigPrettier,
]);
