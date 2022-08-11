// @ts-check
// next.config.js

import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

export default withPWA({
  eslint: { ignoreDuringBuilds: true },
  pwa: { dest: "public", disable: isDev },
  serverRuntimeConfig: { GTM_ID: process.env.GTM_ID || "GTM_ID" }
});
