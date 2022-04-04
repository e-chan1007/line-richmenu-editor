import { orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "@mui/lab/themeAugmentation";
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

export default function App({ Component, pageProps }: AppProps) {
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
      typography: { fontFamily: "Roboto, Noto Sans Japanese, sans-serif" },
      components: {
        MuiButton: { defaultProps: { variant: (uiMode === "system" ? systemMode : uiMode) === "light" ? "contained" : "outlined" }},
        MuiFormControl: { defaultProps: { variant: "standard" }},
        MuiSelect: { defaultProps: { variant: "standard" }},
        MuiTextField: { defaultProps: { variant: "standard" }}
      }
    }),
    [uiMode, systemMode]
  );
  return (
    <React.Fragment>
      <ThemeColorContext.Provider value={newThemeContext}>
        <StyledEngineProvider injectFirst>
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
        </StyledEngineProvider>
      </ThemeColorContext.Provider>
    </React.Fragment>
  );
}
