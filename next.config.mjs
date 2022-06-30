// @ts-check
// next.config.js

import withPWA from "next-pwa";

export default withPWA({
  cssModules: true,
  eslint: { ignoreDuringBuilds: true },
  pwa: { dest: "public", buildExcludes: [/.*codicons.*/, /middleware-manifest.json$/] },
  outputFileTracing: false
});
