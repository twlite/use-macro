// src/index.ts
var version = (
  /* @__MACRO__ $version */
  "1.0.0"
);
var compiledAt = (
  /* @__MACRO__ $compiledAt */
  /* @__PURE__ */ new Date(1736839628646)
);
var message = (
  /* @__MACRO__ $message */
  "Hello World!"
);
var url = (
  /* @__MACRO__ $url */
  [new URL("https://example.com/?foo=bar&baz=qux"), new URLSearchParams([["foo", "bar"], ["baz", "qux"]])]
);
var formData = (
  /* @__MACRO__ $formData */
  new FormData([["foo", "bar"], ["baz", "qux"]])
);
export {
  compiledAt,
  formData,
  message,
  url,
  version
};
