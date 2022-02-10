// @ts-check
// next.config.js

import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import webpack from "webpack";
import _withTM from "next-transpile-modules";
import withPWA from "next-pwa";

const withTM = _withTM([
  "monaco-editor"
]);

export default withPWA(withTM({
  cssModules: true,
  eslint: { ignoreDuringBuilds: true },
  pwa: { dest: "public", disable: process.env.NODE_ENV !== "production" },
  outputFileTracing: false,
  webpack: config => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [
          "json"
        ],
        filename: "static/[name].worker.js"
      })
    );
    config.module.rules.push({
      test: /\.(ttf|woff2)$/i,
      loader: "file-loader",
      options: { name: "[path][name].[ext]" }
    });
    return config;
  }
}));
