import React from "react";
import { AppProps } from "next/app";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <React.Fragment>
      <CssBaseline />
      <Component {...pageProps} />
    </React.Fragment>
  );
}
