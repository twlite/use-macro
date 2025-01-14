import { Plugin } from 'esbuild';
import { MacroTransformer } from './transformer.js';
import { readFile } from 'node:fs/promises';

export const esbuildPluginUseMacro = () => {
  return {
    name: 'esbuild-plugin-use-macro',
    async setup(build) {
      const fileFilter = /\.(c|m|d)?(j|t)sx?$/;
      const transformer = new MacroTransformer();

      build.onLoad({ filter: fileFilter }, async (args) => {
        const content = await readFile(args.path, 'utf-8');
        const transformed = await transformer.transform(content, args.path);
        return transformed;
      });
    },
  } satisfies Plugin;
};
