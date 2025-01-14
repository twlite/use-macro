import { defineConfig } from 'tsup/dist/index.js';
import { esbuildPluginUseMacro } from '../dist/index.js';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  outDir: 'dist',
  target: 'es2020',
  esbuildPlugins: [esbuildPluginUseMacro()],
});
