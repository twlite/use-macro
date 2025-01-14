"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  compiledAt: () => compiledAt,
  formData: () => formData,
  message: () => message,
  url: () => url,
  version: () => version
});
module.exports = __toCommonJS(index_exports);
var version = (
  /* @__MACRO__ $version */
  "1.0.0"
);
var compiledAt = (
  /* @__MACRO__ $compiledAt */
  /* @__PURE__ */ new Date(1736839628630)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compiledAt,
  formData,
  message,
  url,
  version
});
