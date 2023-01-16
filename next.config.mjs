// @ts-check
// next.config.js

import withPWA from "next-pwa";

export default withPWA({ dest: "public" })({
  eslint: { ignoreDuringBuilds: true },
  serverRuntimeConfig: { GTM_ID: process.env.GTM_ID || "GTM_ID" }
});
