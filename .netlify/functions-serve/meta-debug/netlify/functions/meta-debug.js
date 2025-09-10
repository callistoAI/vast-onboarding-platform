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

// netlify/functions/meta-debug.js
var meta_debug_exports = {};
__export(meta_debug_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(meta_debug_exports);
var handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    const clientId = process.env.VITE_NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    const debugInfo = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      method: event.httpMethod,
      path: event.path,
      environment: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdValue: clientId ? clientId.substring(0, 10) + "..." : "undefined",
        clientSecretValue: clientSecret ? "present (hidden)" : "undefined"
      },
      allMetaEnvVars: Object.keys(process.env).filter((key) => key.includes("META")),
      test: {
        canProceed: !!(clientId && clientSecret),
        error: !clientId ? "Missing META_APP_ID" : !clientSecret ? "Missing META_APP_SECRET" : null
      }
    };
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(debugInfo, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Debug function error",
        message: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }, null, 2)
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=meta-debug.js.map
