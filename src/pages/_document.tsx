import React from "react";

import getConfig from "next/config";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const { serverRuntimeConfig } = getConfig();

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="LINE公式アカウントのトーク画面下部に表示される、リッチメニューを作成するツールです。GUI・コードの両方で直感的に編集でき、アップロードまで一貫して行うことができます。" />
          <meta name="theme-color" content="#FF9800" />
          <meta property="og:url" content="https://richmenu.app.e-chan.me/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="リッチメニューエディタ" />
          <meta property="og:description" content="LINE公式アカウントのトーク画面下部に表示される、リッチメニューを作成するツールです。GUI・コードの両方で直感的に編集でき、アップロードまで一貫して行うことができます。" />
          <meta property="og:image" content="https://richmenu.app.e-chan.me/ogp.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="icon" href="/icon.svg" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vscode-codicons/dist/codicon.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
          <Script id="GTM" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${serverRuntimeConfig.GTM_ID}');
            `}
          </Script>
        </Head>
        <body>
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${serverRuntimeConfig.GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
