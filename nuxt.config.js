const bodyParser = require("body-parser");

module.exports = {
  mode: "spa",
  head: {
    title: "リッチメニューエディタ" || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "LINE Messaging API向けリッチメニューエディタ"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: "https://kit.fontawesome.com/3864301cff.js",
        crossorigin: "anonymous"
      }
    ]
  },

  loading: { color: "#ff9800" },

  css: [{ src: "~/assets/scss/main.scss", lang: "scss" }],

  plugins: ["~plugins/ui"],

  buildModules: ["@nuxt/typescript-build"],

  modules: ["@nuxtjs/pwa", "@nuxtjs/style-resources"],
  styleResources: {
    scss: [
      "~/assets/scss/variable/_index.scss",
      "~/assets/scss/mixin/_index.scss"
    ]
  },
  serverMiddleware: [
    bodyParser.json({ limit: "50mb" }),
    { path: "/api/richmenu", handler: "~/api/richmenu.js" }
  ],
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: "https://kit.fontawesome.com/*",
        handler: "cacheFirst",
        method: "GET"
      }
    ]
  },
  manifest: {
    title: "リッチメニューエディタ",
    name: "リッチメニューエディタ",
    short_name: "リッチメニュー",
    description: "LINE Messaging API向けリッチメニューエディタ",
    lang: "ja",
    theme_color: "#ff9800",
    background_color: "#FFFFFF"
  }
};
