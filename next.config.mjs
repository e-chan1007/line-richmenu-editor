// @ts-check
// next.config.js

import withPWA from "next-pwa";

export default withPWA({
  cssModules: true,
  eslint: { ignoreDuringBuilds: true },
  pwa: { dest: "public" },
  serverRuntimeConfig: { GTM_ID: process.env.GTM_ID || "GTM_ID" }
});
