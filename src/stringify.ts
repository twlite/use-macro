import * as devalue from 'devalue';

export async function stringify(value: unknown): Promise<string> {
  if (value instanceof Response) {
    const buf = devalue.uneval(await value.arrayBuffer());
    return `new Response(${buf}, {
      status: ${devalue.uneval(value.status)},
      statusText: ${devalue.uneval(value.statusText)},
      headers: ${devalue.uneval([...value.headers.entries()])},
    })`;
  }

  if (value instanceof Request) {
    return `new Request(${devalue.uneval(value.url)}, {
      method: ${devalue.uneval(value.method)},
      headers: ${devalue.uneval([...value.headers.entries()])},
      body: ${devalue.uneval(await value.text())},
    })`;
  }

  if (value instanceof Promise) {
    return `Promise.resolve(${devalue.uneval(await value)})`;
  }

  return devalue.uneval(value, (value) => {
    if (value instanceof URL) {
      return `new URL(${devalue.uneval(value.href)})`;
    }

    if (value instanceof URLSearchParams) {
      return `new URLSearchParams(${devalue.uneval([...value.entries()])})`;
    }

    if (Buffer.isBuffer(value)) {
      return `Buffer.from(${devalue.uneval(new Uint8Array(value))})`;
    }

    if (value instanceof Headers) {
      return `new Headers(${devalue.uneval([...value.entries()])})`;
    }

    if (value instanceof FormData) {
      return `new FormData(${devalue.uneval([...value.entries()])})`;
    }
  });
}
