import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
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
  return <>
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
              <Box display="flex" flexDirection="row" flexGrow={1} alignItems="center">
                <Typography variant="h6" >
                  リッチメニューエディタ
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Tooltip title="設定">
                  <IconButton
                    onClick={() => setIsSettingsPopoverOpened(!isSettingsPopoverOpened)}
                    ref={settingsButtonRef}
                    sx={{ color: "white" }}
                    size="large">
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
                    <IconButton sx={{ color: "white" }} size="large">
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
  </>;
}
