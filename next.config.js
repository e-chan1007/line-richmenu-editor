// next.config.js

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")([
  "monaco-editor"
]);

module.exports = withTM({
  cssModules: true,
  webpack: (config, options) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [
          "json"
        ],
        filename: "static/[name].worker.js"
      })
    );
    return config;
  }
});
