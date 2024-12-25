import { OnLoadResult, Plugin } from 'esbuild';
import { parse, ParserOptions } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import * as t from '@babel/types';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname } from 'path';
import { runInNewContext } from 'vm';
import * as devalue from 'devalue';
import * as ts from 'typescript';

interface MacroFunction {
  ast: t.FunctionDeclaration | t.FunctionExpression;
  path: string;
  args: t.Node[];
}

const macroCache = new Map<string, string>();

// @ts-ignore
const traverse = (_traverse.default || _traverse) as typeof _traverse;
// @ts-ignore
const generate = (_generate.default || _generate) as typeof _generate;

export const esbuildPluginUseMacro = () => {
  return {
    name: 'esbuild-plugin-use-macro',
    async setup(build) {
      // Store macro functions we find during the build
      const macroFunctions = new Map();

      // Handle all JS/TS/JSX/TSX files
      const fileFilter = /\.(c|m)?(j|t)sx?$/;

      // Helper to get parser options based on file extension
      const getParserOptions = (filepath: string) => {
        const isTS = /\.tsx?$/.test(filepath);
        const isJSX = /\.jsx$/.test(filepath) || /\.tsx$/.test(filepath);
        const isModule = /^m/.test(filepath);

        return {
          sourceType: isModule ? 'module' : 'unambiguous',
          plugins: [
            ...(isTS ? ['typescript'] : []),
            ...(isJSX ? ['jsx'] : []),
            'decorators-legacy',
            'classProperties',
            'optionalChaining',
            'nullishCoalescingOperator',
          ] as ParserOptions['plugins'],
        } satisfies ParserOptions;
      };

      // Helper to transpile TypeScript to JavaScript
      const transpileTypeScript = (code: string, filePath: string) => {
        const result = ts.transpileModule(code, {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ESNext,
          },
          fileName: filePath,
        });
        return result.outputText;
      };

      // Helper to execute macro at compile time
      const executeMacro = (macroFunction: MacroFunction) => {
        const macroCode = generate(macroFunction.ast).code;
        const transpiledCode = /\.tsx?$/.test(macroFunction.path)
          ? transpileTypeScript(macroCode, macroFunction.path)
          : macroCode;

        const macroModule = `
        ${transpiledCode}
        // do not export this as it is evaluated in vm which directly returns the result
        ${macroFunction.ast.id?.name}(${macroFunction.args.join(', ')})`;

        const result = runInNewContext(`${macroModule}`, {
          ...globalThis,
          __dirname: dirname(macroFunction.path),
          __filename: macroFunction.path,
          require: createRequire(macroFunction.path),
          import: (modulePath: string) => import(modulePath),
        });

        return result.default ?? result;
      };

      // Collect macro functions and transform macro calls in a single pass
      build.onLoad({ filter: fileFilter }, async (args) => {
        const contents = await readFile(args.path, 'utf8');
        const ast = parse(contents, getParserOptions(args.path));

        traverse(ast, {
          FunctionDeclaration(path) {
            const body = path.node.body;
            if (t.isBlockStatement(body) && body.directives) {
              const directive = body.directives.find(
                (d) => d.value.value === 'use macro'
              );

              if (directive) {
                const functionName = path.node.id?.name;

                if (!functionName) {
                  throw new Error('Macro function must have a name');
                }

                const macroFunction = {
                  ast: path.node,
                  path: args.path,
                  args: path.node.params,
                };

                macroFunctions.set(functionName, macroFunction);

                // Immediately evaluate the macro function and store the result in the cache
                const result = executeMacro(macroFunction);
                if (result instanceof Promise) {
                  throw new Error(
                    'Macro function must be synchronous and cannot return a Promise'
                  );
                }
                const stringifiedResult = devalue.uneval(result);
                macroCache.set(functionName, stringifiedResult);

                path.remove();
              }
            }
          },

          VariableDeclarator(path) {
            const init = path.node.init;
            if (
              (t.isFunctionExpression(init) ||
                t.isArrowFunctionExpression(init)) &&
              t.isBlockStatement(init.body) &&
              init.body.directives
            ) {
              const directive = init.body.directives.find(
                (d) => d.value.value === 'use macro'
              );

              if (directive && t.isIdentifier(path.node.id)) {
                const functionName = path.node.id.name;
                const macroFunction = {
                  ast: t.functionDeclaration(
                    path.node.id,
                    init.params,
                    init.body
                  ),
                  path: args.path,
                  args: init.params,
                } satisfies MacroFunction;

                macroFunctions.set(functionName, macroFunction);

                // Immediately evaluate the macro function and store the result in the cache
                const result = executeMacro(macroFunction);
                const stringifiedResult = devalue.uneval(result);
                macroCache.set(functionName, stringifiedResult);

                path.parentPath.remove();
              }
            }
          },

          CallExpression(path) {
            if (t.isIdentifier(path.node.callee)) {
              const functionName = path.node.callee.name;
              const evaluatedValue = macroCache.get(functionName);

              if (evaluatedValue) {
                const newNode = t.identifier(evaluatedValue);
                t.addComment(
                  newNode,
                  'leading',
                  ` @__MACRO__ ${functionName} `
                );
                path.replaceWith(newNode);
              }
            }
          },
        });

        const { code } = generate(ast, {
          retainLines: true,
          compact: false,
          sourceMaps: true,
          sourceFileName: args.path,
        });

        return {
          contents: code,
          loader: args.path.split('.').pop() as 'js' | 'jsx' | 'ts' | 'tsx',
        } satisfies OnLoadResult;
      });
    },
  } satisfies Plugin;
};
