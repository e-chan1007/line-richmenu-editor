import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { BotAccount, BotAccountContext } from "contexts/BotAccountContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import botAccountDatabase from "databases/BotAccount";
import richMenuDatabase from "databases/RichMenu";
import React, { useContext, useEffect, useState } from "react";

export default function BotDeleteDialog(
  { botId, isDialogOpened, setIsDialogOpened, handleMenuClose }:
  {
    botId: string,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    handleMenuClose: () => void
  }) {
  const { accounts, setAccounts } = useContext(BotAccountContext);
  const [botToDelete, setBotToDelete] = useState<BotAccount>(null);
  const { richMenuId: editingRichMenuId, setters: { changeRichMenuId }} = useContext(EditingRichMenuContext);
  useEffect(() => {
    (async () => {
      if (botId) setBotToDelete(await botAccountDatabase.accounts.where("basicId").equalsIgnoreCase(botId).first());
    })();
  }, [botId]);

  return (
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} maxWidth="xs">
      <DialogTitle>Botアカウントを削除</DialogTitle>
      <DialogContent>
        <p>{(botToDelete?.botName)}をエディタ上から削除しますか?</p>
        <Alert severity="warning" sx={{ my: 1 }}>
          <ul style={{ margin: 0, padding: 0, marginLeft: "1em" }}>
            <li>この操作は元に戻せません！</li>
            <li>LINEのアカウントを削除する場合は、<a href="https://developers.line.biz/console/" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>LINE Developersのコンソール画面</a>を利用してください。</li>
          </ul>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setIsDialogOpened(false); handleMenuClose(); }} variant="text">キャンセル</Button>
        <Button onClick={() => {
          if (botToDelete.richMenus.includes(editingRichMenuId)) changeRichMenuId("DELETED");
          richMenuDatabase.menus.where("richMenuId").anyOfIgnoreCase(botToDelete.richMenus).delete();
          botAccountDatabase.accounts.delete(botId);
          const newAccounts = [...accounts];
          newAccounts.splice(newAccounts.findIndex(({ basicId }) => basicId === botId), 1);
          setAccounts(newAccounts);
          handleMenuClose();
          setIsDialogOpened(false);
        }} color="error" variant="text">削除</Button>
      </DialogActions>
    </Dialog>
  );
}
