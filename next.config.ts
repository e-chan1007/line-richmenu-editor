// @ts-check
// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["monaco-editor"]
};

export default nextConfig;
