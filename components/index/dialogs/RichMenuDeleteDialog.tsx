import Alert from "@material-ui/core/Alert";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { BotAccountContext } from "contexts/BotAccountContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import richMenuDatabase from "databases/RichMenu";
import React, { useContext, useEffect, useState } from "react";
import { StoragedRichMenu } from "types/RichMenu";

export default function RichMenuDeleteDialog(
  { richMenuId, isDialogOpened, setIsDialogOpened, handleMenuClose: handleMenuClose }:
  {
    richMenuId: string,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    handleMenuClose: () => void
  })
  : JSX.Element {
  const { accounts, setAccounts } = useContext(BotAccountContext);
  const { richMenuId: editingRichMenuId, setters: { changeRichMenuId } } = useContext(EditingRichMenuContext);
  const [richMenuToDelete, setRichMenuToDelete] = useState<StoragedRichMenu>(null);
  useEffect(() => {
    (async () => {
      if (richMenuId) setRichMenuToDelete(await richMenuDatabase.menus.where("richMenuId").equalsIgnoreCase(richMenuId).first());
    })();
  }, [richMenuId]);

  return (
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} maxWidth="xs">
      <DialogTitle>リッチメニューを削除</DialogTitle>
      <DialogContent>
        <p>{!(richMenuToDelete?.menu?.name) && "名称未設定の" }リッチメニュー{(richMenuToDelete?.menu?.name) && `「${richMenuToDelete.menu.name}」` }をエディタ上から削除しますか?</p>
        <Alert severity="warning" sx={{ my: 1 }}>
          {richMenuId?.startsWith?.("richmenu-") ? (
            <ul style={{ margin: 0, padding: 0, marginLeft: "1em" }}>
              <li>この操作は元に戻せません！</li>
              <li>LINEのサーバー上からも削除する場合は、API操作画面を利用してください。</li>
            </ul>
          ) : (
            "この操作は元に戻せません！"
          )}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpened(false)}>キャンセル</Button>
        <Button onClick={() => {
          const richMenuIdToDelete = richMenuId;
          richMenuDatabase.menus.delete(editingRichMenuId);
          setAccounts(accounts.map(account =>
            ({ ...account, richMenus: account.richMenus.filter(richMenuId => richMenuId !== richMenuIdToDelete) })
          ));
          if (richMenuIdToDelete === editingRichMenuId) changeRichMenuId("DELETED");
          handleMenuClose();
          setIsDialogOpened(false);
        }} color="error">削除</Button>
      </DialogActions>
    </Dialog>
  );
}
