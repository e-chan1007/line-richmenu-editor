import React, { useContext } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";

export default function TapAreaBulkDeleteDialog(
  { isDialogOpen: [isDialogOpen, forBulkCreate], setIsDialogOpen, onDeleted }:
  {
    isDialogOpen: [boolean, boolean],
    setIsDialogOpen: React.Dispatch<React.SetStateAction<[boolean, boolean]>>,
    onDeleted: () => void
  }
) {
  const { setters: { setAreas } } = useContext(EditingRichMenuContext);
  return (
    <Dialog onClose={() => setIsDialogOpen([false, forBulkCreate])} open={isDialogOpen} maxWidth="xs" fullWidth>
      <DialogTitle>領域の一括削除</DialogTitle>
      <DialogContent>
        { forBulkCreate && "領域をまとめて設定するためには、現在設定されている領域をすべて削除する必要があります。" } 削除しますか?
        <Alert severity="warning" sx={{ my: 1 }}>
          この操作は元に戻せません！
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setIsDialogOpen([false, forBulkCreate]); }} variant="text">キャンセル</Button>
        <Button onClick={async () => {
          setAreas([]);
          setIsDialogOpen([false, forBulkCreate]);
          onDeleted();
        }}
        variant="text"
        >はい</Button>
      </DialogActions>
    </Dialog>
  );
}
