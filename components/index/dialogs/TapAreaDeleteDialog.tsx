import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext, useEffect, useState } from "react";
import TapAreaController from "../TapAreaController";

export default function TapAreaDeleteDialog(
  { editingAreaIndex, isDialogOpened, setIsDialogOpened, setActiveAreaIndex }:
  {
    editingAreaIndex: number,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
  })
  : JSX.Element {
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
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} maxWidth="xs">
      <DialogTitle>タップ領域を削除</DialogTitle>
      <DialogContent>
        <TapAreaController {...{
          menuImage,
          bounds
        }}
        readonly
        width={396} />
        <p>この領域を削除しますか?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpened(false)} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newAreas = [...areas];
          newAreas.splice(editingAreaIndex, 1);
          setAreas(newAreas);
          setIsDialogOpened(false);
          setActiveAreaIndex(null);
        }} color="error" variant="text">削除</Button>
      </DialogActions>
    </Dialog>
  );
}
