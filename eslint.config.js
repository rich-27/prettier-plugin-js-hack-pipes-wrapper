import { defineConfig } from 'eslint/config';
import babelParser from '@babel/eslint-parser';
import js from "@eslint/js";
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    languageOptions: {
      parser: babelParser,
    },
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended']
  },
  {
    ignores: ['dist/**', 'vendor/**'],
  },
  eslintConfigPrettier,
]);
