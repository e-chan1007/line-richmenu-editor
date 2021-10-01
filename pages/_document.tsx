import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="LINE公式アカウントのトーク画面下部に表示される、リッチメニューを作成するツールです。GUI・コードの両方で直感的に編集でき、アップロードまで一貫して行うことができます。" />
          <meta name="theme-color" content="#FF9800" />
          <meta property="og:url" content="https://richmenu.app.e-chan.cf/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="リッチメニューエディタ" />
          <meta property="og:description" content="LINE公式アカウントのトーク画面下部に表示される、リッチメニューを作成するツールです。GUI・コードの両方で直感的に編集でき、アップロードまで一貫して行うことができます。" />
          <meta property="og:image" content="https://richmenu.app.e-chan.cf/ogp.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="icon" href="/icon.svg" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
