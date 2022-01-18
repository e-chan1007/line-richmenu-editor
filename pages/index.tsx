import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Stack from "@material-ui/core/Stack";
import { useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";
import CodeIcon from "@material-ui/icons/Code";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import APIControlCard from "components/index/cards/APIControlCard";
import BasicSettingsCard from "components/index/cards/BasicSettingsCard";
import ImageSelectCard from "components/index/cards/ImageSelectCard";
import JSONEditorCard from "components/index/cards/JSONEditorCard";
import TapAreaSettingsCard from "components/index/cards/TapAreaSettingsCard";
import BotSettingsDialog from "components/index/dialogs/BotSettingsDialog";
import LeftSideDrawer from "components/index/LeftSideDrawer";
import LINEScreen from "components/index/LINEScreen";
import Phone from "components/index/Phone";
import { APIControllerContext } from "contexts/APIControllerContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import { PageLoadingStateContext } from "contexts/PageLoadingStateContext";
import MainLayout from "layouts/main";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";

export default function Index() {
  const theme = useTheme();
  const { dataStore: apiStore, _setStoreValue: setAPIStore } = useContext(APIControllerContext);
  const { richMenuId, isRichMenuIdReplaced } = useContext(EditingRichMenuContext);
  const { isPageLoading } = useContext(PageLoadingStateContext);
  const [tabIndex, setTabIndex] = useState("0");
  const [activeAreaIndex, setActiveAreaIndex] = useState<number>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImageWrong, setIsImageWrong] = useState(false);
  const [isBotSettingsDialogOpen, setIsBotSettingsDialogOpen] = useState(false);
  useEffect(() => {
    if (!isRichMenuIdReplaced) {
      setTabIndex("0");
      setAPIStore({});
    }
  }, [richMenuId]);
  return (
    <MainLayout {...{ onMenuButtonClick: () => setIsDrawerOpen(!isDrawerOpen) }}>
      <Head>
        <title>リッチメニューエディタ</title>
      </Head>
      <Box display="flex" sx={{ height: "100%" }}>
        <>
          <Drawer
            variant={useMediaQuery(theme.breakpoints.up("xl")) ? "permanent" : "temporary"}
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sx={{
              width: "320px",
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: "320px", boxSizing: "border-box" }
            }}
          >
            <Toolbar variant="dense" />
            <LeftSideDrawer {...{ setIsBotSettingsDialogOpen }} />
          </Drawer>
          {richMenuId ? (
            <Grid container padding="8px">
              <Grid item xs={12} lg={8}>
                <TabContext value={tabIndex} >
                  <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
                    <TabList
                      onChange={(_, newIndex) => { setTabIndex(newIndex); }}
                      indicatorColor="primary"
                      textColor="primary"
                      centered

                    >
                      <Tab label="メニュー設定" icon={<ViewModuleIcon />} value="0" />
                      <Tab label="コード編集" icon={<CodeIcon />} value="1" />
                      <Tab label="API操作(メニュー別)" icon={<CloudQueueIcon />} value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="0">
                    <Stack spacing={2}>
                      <BasicSettingsCard key="BasicSettingsCard" />
                      <ImageSelectCard key="ImageSelectCard" {...{ setIsImageWrong }} />
                      <TapAreaSettingsCard key="TapAreaSettingsCard" {...{ activeAreaIndex, setActiveAreaIndex, isImageWrong }} />
                    </Stack>
                  </TabPanel>
                  <TabPanel value="1" >
                    <JSONEditorCard />
                  </TabPanel>
                  <TabPanel value="2" >
                    <APIControlCard />
                  </TabPanel>
                </TabContext>
              </Grid>
              <Grid item xs={12} lg={4} sx={{ display: "flex", justifyContent: "center", pr: 2 }} >
                <Box sx={{ width: "80%" }}>
                  <Phone>
                    <LINEScreen {...{ activeAreaIndex, setActiveAreaIndex }} />
                  </Phone>
                </Box>
              </Grid>
            </Grid>
          ) : isPageLoading || (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <Typography variant="h4">リッチメニューエディタ</Typography>
                <p>左メニューからリッチメニューを作成してください。</p>
                <Divider sx={{ width: "256px", my: 2 }} />
                <Button variant="text" onClick={() => setIsBotSettingsDialogOpen(true)}>Botを追加する</Button>
                <div>
                  <Button variant="text" href="https://developers.line.biz/ja/docs/messaging-api/using-rich-menus/" target="_blank" rel="noreferrer">
                    ドキュメントを読む
                  </Button>
                  <Button variant="text" href="https://developers.line.biz/ja/reference/messaging-api/#rich-menu" target="_blank" rel="noreferrer">
                    リファレンスを読む
                  </Button>
                </div>
              </Box>
            </>
          )}
        </>
      </Box>
      <BotSettingsDialog isDialogOpened={isBotSettingsDialogOpen} setIsDialogOpened={setIsBotSettingsDialogOpen} />
    </MainLayout>
  );
}
