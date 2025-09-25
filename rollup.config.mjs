import terser from '@rollup/plugin-terser';

export default {
  input: 'src/plugin.js',
  output: {
    dir: 'dist',
    sourcemap: true,
  },
  plugins: [terser()],
};
