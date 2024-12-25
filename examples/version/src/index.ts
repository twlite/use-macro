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
