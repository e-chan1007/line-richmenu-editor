// next.config.js

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")([
  "monaco-editor"
]);

module.exports = withTM({
  cssModules: true,
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
});
