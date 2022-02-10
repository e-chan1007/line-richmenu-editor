import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import axiosBase from "axios";
import { BotAccountContext } from "contexts/BotAccountContext";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

const axios = axiosBase.create({ baseURL: "https://cors.api.e-chan.cf/", headers: { "Content-Type": "application/json" }, responseType: "json" });

export default function BotSettingsDialog(
  { isDialogOpened, setIsDialogOpened }:
  { isDialogOpened: boolean, setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { editingBotId, accounts, setAccounts } = useContext(BotAccountContext);
  const [channelAccessToken, setChannelAccessToken] = useState(accounts[editingBotId]?.channelAccessToken || "");
  const [isChannelAccessTokenValid, setIsChannelAccessTokenValid] = useState(false);
  const [channelAccessTokenValidated, setChannelAccessTokenValidated] = useState(false);
  const [isChannelAccessTokenValidating, setChannelAccessTokenValidating] = useState(false);
  const saveButtonRef = useRef(null);
  const existedAccount = useMemo(() => accounts.find(
    ({ channelAccessToken: accountChannelAccessToken }) => accountChannelAccessToken === channelAccessToken
  ), [accounts, channelAccessToken]);
  useEffect(() => {
    setChannelAccessTokenValidated(false);
  }, []);
  return (
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} maxWidth="xs" fullWidth>
      <DialogTitle>Botアカウントを{editingBotId.length > 0 ? "編集" : "追加"}</DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="flex-end">
          <TextField label="チャネルアクセストークン" sx={{ flex: 1 }} value={channelAccessToken} onChange={e => setChannelAccessToken(e.target.value)} onKeyDown={e => e.key === "Enter" && saveButtonRef.current.click()} required />
          <Tooltip title={<span>チャネルアクセストークンは、<a href="https://developers.line.biz/console/" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>LINE Developersのコンソール画面</a>から取得してください。エディタでのトークンの取り扱いについては、<a href="https://e-chan1007.notion.site/a566a179f3db4e78b1ae883be23aad38" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>プライバシーポリシー</a>をご覧ください。</span>} arrow>
            <InfoIcon sx={{ m: 1 }} />
          </Tooltip>
        </Stack>
        {!isChannelAccessTokenValid && channelAccessTokenValidated && (
          <Alert severity="error" sx={{ my: 2 }}>該当するアカウントが見つかりませんでした。</Alert>
        )}
        {existedAccount && (
          <Alert severity="error" sx={{ my: 2 }}>{existedAccount?.botName}はすでに登録されています。</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpened(false)} variant="text">キャンセル</Button>
        <LoadingButton
          ref={saveButtonRef}
          onClick={async () => {
            setChannelAccessTokenValidating(true);
            const result = await axios.get("api.line.me/v2/bot/info", { headers: { Authorization: `Bearer ${channelAccessToken.trim()}` } }).catch(({ response }) => response);
            setChannelAccessTokenValidating(false);
            setChannelAccessTokenValidated(true);
            if (result.status === 200) {
              setIsChannelAccessTokenValid(true);
              const account = {
                basicId: result.data.basicId,
                botName: result.data.displayName,
                channelAccessToken: channelAccessToken.trim(),
                richMenus: [],
                pictureUrl: result.data.pictureUrl
              };
              const newAccounts = [...accounts];
              if (editingBotId) {
                newAccounts.splice(newAccounts.findIndex(account => account.basicId === editingBotId), 1, account);
              } else {
                newAccounts.push(account);
              }
              setAccounts(newAccounts);
              setIsDialogOpened(false);
              setChannelAccessToken("");
            } else {
              setIsChannelAccessTokenValid(false);
            }
          }}
          disabled={channelAccessToken.length === 0 || Boolean(existedAccount)}
          loading={isChannelAccessTokenValidating}
          variant="text">{editingBotId.length > 0 ? "編集" : "追加"}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
