import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/react-native/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  tsconfig: './tsconfig.json',
  target: 'es2017',
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: false,
  dts: true,
});
