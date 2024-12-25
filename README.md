# ESBuild Plugin Use Macro

This is a plugin for [esbuild](https://esbuild.github.io/) that allows you to use macros in your code. Macros are a way to define a function that will be executed at compile time, and will replace the macro call with the result of the function.

## Installation

```bash
npm install use-macro
```

## Usage

### Lets create a simple macro that will extract the version from the package.json file

```typescript
function getVersion(): string {
  'use macro';
  const { version } = require('../package.json');
  console.log(`Version: ${version}`);

  return version;
}

function compiledAt(): number {
  'use macro';
  return Date.now();
}

export const version = getVersion();
export const compiledAtTime = compiledAt();
```

### Now lets register the macro in the esbuild plugin

```typescript
import { build } from 'esbuild';
import { esbuildPluginUseMacro } from 'use-macro';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [esbuildPluginUseMacro()],
}).catch(() => process.exit(1));
```

> Note: You can also use this plugin with [tsup](https://tsup.egoist.sh/) by passing the `esbuildOptions` object to the `tsup` function.

### Now lets run the build. The output will be:

<!-- prettier-ignore -->
```javascript
var version = (
  /* @__MACRO__ getVersion */
  "1.0.0"
);
var compiledAtTime = (
  /* @__MACRO__ compiledAt */
  1735106434746
);
export {
  compiledAtTime,
  version
};
```

Notice how entire function was removed and the function call was replaced with the result of the function.
