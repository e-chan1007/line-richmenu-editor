import React from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as zip from "@zip.js/zip.js";

import botAccountDatabase from "databases/BotAccount";
import richMenuDatabase from "databases/RichMenu";

export default function AllDataExportDialog(
  { isDialogOpen, setIsDialogOpen, handleMenuClose }:
  {
    isDialogOpen: boolean,
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleMenuClose: () => void
  }) {
  return (
    <Dialog onClose={() => setIsDialogOpen(false)} open={isDialogOpen} maxWidth="xs" fullWidth>
      <DialogTitle>すべてのデータをエクスポート</DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          このデータには、チャネルアクセストークンが含まれます。扱いには十分注意してください。
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setIsDialogOpen(false); handleMenuClose(); }} variant="text">キャンセル</Button>
        <Button onClick={async () => {
          const { exportDB } = await import("dexie-export-import");
          const botAccountBlob = await exportDB(botAccountDatabase);
          const richMenuBlob = await exportDB(richMenuDatabase);
          const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
          await zipWriter.add("bot-account.json", new zip.BlobReader(botAccountBlob));
          await zipWriter.add("richmenu.json", new zip.BlobReader(richMenuBlob));
          const zipFile = await zipWriter.close();
          const downloadLink = document.createElement("a");
          downloadLink.download = `richmenueditor-exports.zip`;
          downloadLink.href = URL.createObjectURL(zipFile);
          downloadLink.click();
          handleMenuClose();
          setIsDialogOpen(false);
        }}
        variant="text"
        >エクスポート</Button>
      </DialogActions>
    </Dialog>
  );
}
