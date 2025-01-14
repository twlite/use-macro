function $version(): string {
  'use macro';
  const { version } = require('../package.json');
  console.log(`Version: ${version}`);

  return version;
}

function $compiledAt(): Date {
  'use macro';
  return new Date();
}

async function $message(): Promise<string> {
  'use macro';

  const fs = require('fs').promises;
  const path = require('path');
  const messageText = path.resolve(__dirname, 'message.txt');
  const res = await fs.readFile(messageText, 'utf8');

  return res;
}

const $url = () => {
  'use macro';
  const url = new URL('https://example.com?foo=bar&baz=qux');

  return [url, url.searchParams];
};

const $formData = function () {
  'use macro';
  const formData = new FormData();
  formData.append('foo', 'bar');
  formData.append('baz', 'qux');

  return formData;
};

export const version = $version();
export const compiledAt = $compiledAt();
export const message = $message() as unknown as Awaited<
  ReturnType<typeof $message>
>;
export const url = $url();
export const formData = $formData();
