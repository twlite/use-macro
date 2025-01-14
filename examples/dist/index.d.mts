declare function $message(): Promise<string>;
declare const version: string;
declare const compiledAt: Date;
declare const message: Awaited<ReturnType<typeof $message>>;
declare const url: (URL | URLSearchParams)[];
declare const formData: FormData;

export { compiledAt, formData, message, url, version };
