import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Stack from "@material-ui/core/Stack";
import { useTheme } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/core/ToggleButton";
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import BrightnessAutoIcon from "@material-ui/icons/BrightnessAuto";
import MenuIcon from "@material-ui/icons/Menu";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import SettingsIcon from "@material-ui/icons/Settings";
import { PageLoadingStateContext } from "contexts/PageLoadingStateContext";
import { ThemeColorContext } from "pages/_app";
import React, { useContext, useRef, useState } from "react";

export default function MainLayout({
  children,
  onMenuButtonClick
}: {
  children: React.ReactNode,
  onMenuButtonClick?: (event: React.MouseEvent) => void}
) {
  const theme = useTheme();
  const settingsButtonRef = useRef();
  const [isSettingsPopoverOpened, setIsSettingsPopoverOpened] = useState(false);
  const { uiMode, setUIMode, editorMode, setEditorMode } = useContext(ThemeColorContext);
  const { isPageLoading } = useContext(PageLoadingStateContext);
  return (
    <>
      <Box height="100vh">
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar variant="dense">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xl: "none" } }}
              onClick={onMenuButtonClick}
            >
              <MenuIcon />
            </IconButton>
            <Container maxWidth="xl">
              <Box display="flex" flexDirection="row">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 0.25 }}>
                  <span style={{ verticalAlign: "middle" }}>リッチメニューエディタ</span>
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="設定">
                    <IconButton
                      onClick={() => setIsSettingsPopoverOpened(!isSettingsPopoverOpened)}
                      ref={settingsButtonRef}
                      sx={{ color: "white" }}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    anchorEl={settingsButtonRef.current}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={isSettingsPopoverOpened}
                    onClose={() => setIsSettingsPopoverOpened(false)}
                  >
                    <Box sx={{ m: 2 }}>
                      <Stack spacing={2}>
                        <FormGroup>
                          <FormLabel>UIの配色</FormLabel>
                          <ToggleButtonGroup
                            color="primary"
                            value={uiMode}
                            exclusive
                            onChange={(_, mode) => mode && setUIMode(mode)}
                          >
                            <ToggleButton value="system"><BrightnessAutoIcon sx={{ mr: 1 }}/>システム設定と同期</ToggleButton>
                            <ToggleButton value="light"><Brightness7Icon sx={{ mr: 1 }}/>ライトモード</ToggleButton>
                            <ToggleButton value="dark"><Brightness4Icon sx={{ mr: 1 }}/>ダークモード</ToggleButton>
                          </ToggleButtonGroup>
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>コードエディタの配色</FormLabel>
                          <ToggleButtonGroup
                            color="primary"
                            value={editorMode}
                            exclusive
                            onChange={(_, mode) => mode && setEditorMode(mode)}
                          >
                            <ToggleButton value="system"><BrightnessAutoIcon sx={{ mr: 1 }}/>システム設定と同期</ToggleButton>
                            <ToggleButton value="light"><Brightness7Icon sx={{ mr: 1 }}/>ライトモード</ToggleButton>
                            <ToggleButton value="dark"><Brightness4Icon sx={{ mr: 1 }}/>ダークモード</ToggleButton>
                          </ToggleButtonGroup>
                        </FormGroup>
                      </Stack>
                    </Box>
                  </Popover>
                  <Tooltip title="Messaging API リファレンス (LINE Developers)">
                    <a href="https://developers.line.biz/ja/reference/messaging-api/#rich-menu-structure" target="_blank" rel="noopener noreferrer">
                      <IconButton
                        sx={{ color: "white" }}>
                        <MenuBookIcon />
                      </IconButton>
                    </a>
                  </Tooltip>
                </Stack>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: "calc(100vh - 48px)" }}>
          <Toolbar variant="dense" />
          {children}
        </Box>
      </Box>
      <Backdrop
        sx={{ zIndex: theme => theme.zIndex.drawer + 1, backgroundColor: "transparent" }}
        open={isPageLoading}
      >
        <div style={{ width: "72px", height: "72px", background: "rgba(0, 0, 0, 0.5)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </>
  );
}
