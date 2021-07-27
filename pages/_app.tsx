import { orange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "@material-ui/lab/themeAugmentation";
import { APIControllerContextProvider } from "contexts/APIControllerContext";
import { BotAccountContextProvider } from "contexts/BotAccountContext";
import { EditingRichMenuContextProvider } from "contexts/EditingRichMenuContext";
import { JSONEditorContextProvider } from "contexts/JSONEditorContext";
import { PageLoadingStateContextProvider } from "contexts/PageLoadingStateContext";
import { AppProps } from "next/app";
import React, { createContext, useEffect, useMemo, useState } from "react";

export type UIMode = "light" | "dark";

type ThemeColorContextType = {
  uiMode: "system" | UIMode,
  setUIMode: React.Dispatch<React.SetStateAction<"system" | UIMode>>,
  editorMode: "system" | UIMode,
  setEditorMode: React.Dispatch<React.SetStateAction<"system" | UIMode>>,
  systemMode: UIMode,
  setSystemMode: React.Dispatch<React.SetStateAction<UIMode>>
}

export const ThemeColorContext = createContext<ThemeColorContextType>({
  uiMode: "system",
  setUIMode: () => {},
  editorMode: "dark",
  setEditorMode: () => {},
  systemMode: "light",
  setSystemMode: () => {}
});

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [uiMode, setUIMode] = useState<"system" | UIMode>("system");
  const [editorMode, setEditorMode] = useState<"system" | UIMode>("dark");
  const [systemMode, setSystemMode] = useState<UIMode>("light");
  const isSystemPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  useEffect(() => {
    const savedUIMode = window.localStorage.getItem("config.uiMode");
    const savedEditorMode = window.localStorage.getItem("config.editorMode");
    if (/^(light|dark|system)$/.test(savedUIMode)) setUIMode(savedUIMode as "light" | "dark" | "system");
    if (/^(light|dark|system)$/.test(savedEditorMode)) setEditorMode(savedEditorMode as "light" | "dark" | "system");
  }, []);
  useEffect(() => { window.localStorage.setItem("config.uiMode", uiMode); }, [uiMode]);
  useEffect(() => { window.localStorage.setItem("config.editorMode", editorMode); }, [editorMode]);
  useEffect(() => { setSystemMode(isSystemPrefersDarkMode ? "dark" : "light"); }, [isSystemPrefersDarkMode]);
  const newThemeContext = { uiMode, setUIMode, editorMode, setEditorMode, systemMode, setSystemMode };

  const theme = useMemo(
    () => createTheme({
      palette: {
        primary: {
          ...orange,
          contrastText: "#FFF"
        },
        mode: uiMode === "system" ? systemMode : uiMode
      },
      components: {
        MuiTextField: { defaultProps: { variant: "standard" } },
        MuiFormControl: { defaultProps: { variant: "standard" } },
        MuiSelect: { defaultProps: { variant: "standard" } }
      }
    }),
    [uiMode, systemMode]
  );
  return (
    <React.Fragment>
      <ThemeColorContext.Provider value={newThemeContext}>
        <ThemeProvider theme={theme}>
          <PageLoadingStateContextProvider>
            <CssBaseline />
            <BotAccountContextProvider>
              <EditingRichMenuContextProvider>
                <JSONEditorContextProvider>
                  <APIControllerContextProvider>
                    <Component {...pageProps} />
                  </APIControllerContextProvider>
                </JSONEditorContextProvider>
              </EditingRichMenuContextProvider>
            </BotAccountContextProvider>
          </PageLoadingStateContextProvider>
        </ThemeProvider>
      </ThemeColorContext.Provider>
    </React.Fragment>
  );
}
