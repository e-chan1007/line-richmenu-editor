import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import CheckIcon from "@mui/icons-material/Check";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Ajv from "ajv";
import axios from "axios";
import { BotAccount, BotAccountContext } from "contexts/BotAccountContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import { PageLoadingStateContext } from "contexts/PageLoadingStateContext";
import botAccountDatabase from "databases/BotAccount";
import richMenuSchema from "../../../../public/schemas/richmenu.json";
import React, { useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function RichMenuImportDialog(
  { botId, isDialogOpened, setIsDialogOpened, handleMenuClose }:
  {
    botId: string,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    handleMenuClose: () => void
  }) {
  const { accounts, setAccounts } = useContext(BotAccountContext);
  const { setIsPageLoading } = useContext(PageLoadingStateContext);
  const { reset: resetRichMenu, setters: richMenuSetters } = useContext(EditingRichMenuContext);
  const [botToInsertRichMenu, setBotToInsertRichMenu] = useState<BotAccount>(null);
  const [tabIndex, setTabIndex] = useState("0");
  const currentAccount = useMemo(() => accounts.find(({ basicId }) => basicId === botId), [accounts, botId]);
  const { data: remoteRichMenuList } = useSWR<{ richmenus: { [key: string]: string }[] }>(() => (currentAccount.channelAccessToken) ? `/api/line?target=api.line.me/v2/bot/richmenu/list` : null, url => axios.get(url, { headers: { Authorization: `Bearer ${currentAccount.channelAccessToken}` }}).then(({ data }) => data), { dedupingInterval: 5000 });
  const [selectedRichMenuIndex, setSelectedRichMenuIndex] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isJSONValid, setIsJSONValid] = useState(true);
  const [jsonToAdd, setJSONToAdd] = useState("");
  const [isMenuOverriden, setIsMenuOverriden] = useState(true);

  const onFileSelected = e => {
    if (!e.target.files[0]) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = () => {
      let jsonFileValueAsObject;
      setIsFileSelected(true);
      try {
        jsonFileValueAsObject = JSON.parse(fileReader.result as string);
      } catch (_) {
        setIsJSONValid(false);
        return;
      }
      const isJSONValid = new Ajv().compile(richMenuSchema)(jsonFileValueAsObject);
      setIsJSONValid(isJSONValid);
      if (isJSONValid) {
        setJSONToAdd(fileReader.result as string);
      }
    };
    fileReader.onerror = () => setIsJSONValid(false);
  };

  /* useEffect(() => {
    setSelectedRichMenuIndex(0);
    setIsJSONValid(true);
    setIsFileSelected(false);
    setJSONToAdd("");
  }, []); */

  useEffect(() => {
    (async () => {
      if (botId) setBotToInsertRichMenu(await botAccountDatabase.accounts.where("basicId").equalsIgnoreCase(botId).first());
    })();
  }, [botId]);

  useEffect(() => {
    setIsFileSelected(false);
  }, [isDialogOpened]);

  useEffect(() => {
    if (remoteRichMenuList?.richmenus) setJSONToAdd(JSON.stringify(remoteRichMenuList.richmenus[selectedRichMenuIndex]));
  }, [remoteRichMenuList, selectedRichMenuIndex]);

  return (
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} maxWidth="sm" fullWidth>
      <DialogTitle>{(botToInsertRichMenu?.botName)}にリッチメニューをインポート</DialogTitle>
      <DialogContent>
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={(_, v) => setTabIndex(v)} centered>
              <Tab label="ファイルから" value="0" />
              <Tab label="LINE上から" value="1" />
            </TabList>
          </Box>
          <TabPanel value="0">
            <label>
              <input accept=".json" type="file" style={{ display: "none" }} onChange={onFileSelected} />
              <Button component="span" fullWidth>
                {isFileSelected && isJSONValid && <CheckIcon sx={{ mr: 2 }} />}JSONファイルを選択
              </Button>
            </label>
            {!isJSONValid && (
              <Alert severity="error" sx={{ my: 2 }}>
                このファイルの内容は正しいリッチメニューではありません
              </Alert>
            )}
          </TabPanel>
          <TabPanel value="1">
            <Select
              value={selectedRichMenuIndex}
              onChange={event => setSelectedRichMenuIndex(event.target.value as number)}
              label="メニュー"
              fullWidth
            >
              {remoteRichMenuList &&
                remoteRichMenuList.richmenus.sort(({ name: a }, { name: b }) => a.localeCompare(b)).map((richMenu, i) => (
                  <MenuItem value={i} key={i}>
                    {[(<ListItemText primary={richMenu.name} secondary={richMenu.richMenuId} key={i} />)]}
                  </MenuItem>
                ))}
            </Select>
            {
              currentAccount?.richMenus &&
              currentAccount.richMenus.includes(remoteRichMenuList?.richmenus?.[selectedRichMenuIndex]?.richMenuId) && (
                <Alert severity="warning" sx={{ my: 1 }}>
                  同一IDのメニューがエディタ上に存在します。<br />
                  エディタ上のメニューを上書きせず、別のメニューとして保存する場合はチェックを外してください。<br />
                  <FormControlLabel control={<Checkbox defaultChecked value={isMenuOverriden} onChange={e => setIsMenuOverriden(e.target.checked)} />} label="メニューを上書き保存する" />
                </Alert>
              )
            }
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setIsDialogOpened(false);
          handleMenuClose();
        }} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newRichMenuId = (
            isMenuOverriden ?
              resetRichMenu(remoteRichMenuList?.richmenus?.[selectedRichMenuIndex]?.richMenuId) :
              resetRichMenu()
          ) as string;
          const newAccounts = [...accounts];
          newAccounts.splice(
            newAccounts.findIndex(({ basicId }) => basicId === botId),
            1,
            { ...currentAccount, richMenus: [...currentAccount.richMenus, newRichMenuId] }
          );
          setAccounts(newAccounts);
          setIsDialogOpened(false);
          handleMenuClose();

          Object.entries(JSON.parse(jsonToAdd)).forEach(([key, value]) => {
            if (key !== "richMenuId") richMenuSetters[`set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`](value);
          });

          if (tabIndex === "1" && remoteRichMenuList?.richmenus?.[selectedRichMenuIndex]?.richMenuId) {
            (async () => {
              setIsPageLoading(true);
              const imageData = await axios.get<Blob>(`/api/line?target=api-data.line.me/v2/bot/richmenu/${remoteRichMenuList.richmenus[selectedRichMenuIndex].richMenuId}/content`, { headers: { Authorization: `Bearer ${currentAccount.channelAccessToken}` }, responseType: "blob" });
              const reader = new FileReader();
              reader.readAsDataURL(imageData.data);
              await new Promise(resolve => { reader.onload = resolve; });
              const image = document.createElement("img");
              image.src = reader.result as string;
              await new Promise(resolve => { image.onload = resolve; });
              richMenuSetters.setMenuImage({
                fileName: remoteRichMenuList.richmenus[selectedRichMenuIndex].richMenuId,
                fileType: imageData.headers.contentType === "image/jpeg" ? "JPEG" : "PNG",
                fileSize: Math.floor(imageData.data.size / 1024),
                image
              });
              setIsPageLoading(false);
            })();
          }
        }}
        variant="text"
        disabled={!((tabIndex === "0" && isFileSelected && isJSONValid) || (tabIndex === "1" && jsonToAdd !== ""))}>インポート</Button>
      </DialogActions>
    </Dialog>
  );
}
