import * as fs from 'node:fs';
import prettier from 'prettier';

const testFile = fs.readFileSync('test/test.js', 'utf8');
const formatted = await prettier.format(testFile, {
  parser: '|>-babel-wrapper',
  printer: '|>-wrapped-ast',
  plugins: ['./src/plugin.js'],
});

console.log(`Input: ${testFile}`);
console.log(`Output: ${formatted}`);
