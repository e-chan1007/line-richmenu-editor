import React, { useContext, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";

import TapAreaController from "../TapAreaController";

export default function TapAreaDeleteDialog(
  { editingAreaIndex, isDialogOpen, setIsDialogOpen, setActiveAreaIndex }:
  {
    editingAreaIndex: number,
    isDialogOpen: boolean,
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
  }) {
  const { menuImage, menu: { areas }, setters: { setAreas } } = useContext(EditingRichMenuContext);
  const [bounds, setBounds] = useState<(number|boolean)[]>([]);
  useEffect(() => {
    if (areas[editingAreaIndex]) {
      setBounds([
        areas[editingAreaIndex].bounds.x,
        areas[editingAreaIndex].bounds.y,
        areas[editingAreaIndex].bounds.width,
        areas[editingAreaIndex].bounds.height,
        true
      ]);
    }
  }, [areas, editingAreaIndex]);
  return (
    <Dialog onClose={() => setIsDialogOpen(false)} open={isDialogOpen} maxWidth="xs">
      <DialogTitle>タップ領域を削除</DialogTitle>
      <DialogContent>
        <TapAreaController {...{
          menuImage,
          bounds
        }}
        readonly
        width={396} />
        <p>この領域を削除しますか?</p>
        <Alert severity="warning" sx={{ my: 1 }}>
          <ul style={{ margin: 0, padding: 0, marginLeft: "1em" }}>
            <li>この操作は元に戻せません！</li>
            <li>Shiftキーを押しながら削除ボタンを押すと、この画面を表示せずに直接削除できます。</li>
          </ul>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpen(false)} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newAreas = [...areas];
          newAreas.splice(editingAreaIndex, 1);
          setAreas(newAreas);
          setIsDialogOpen(false);
          setActiveAreaIndex(null);
        }} color="error" variant="text">削除</Button>
      </DialogActions>
    </Dialog>
  );
}
