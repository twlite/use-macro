import { defineConfig } from 'tsup';
import { esbuildPluginUseMacro } from '../../dist/index.js';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2020',
  esbuildPlugins: [esbuildPluginUseMacro()],
});
