import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input, { InputProps } from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Stack from "@material-ui/core/Stack";
import { useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext, useEffect, useState } from "react";
import TapAreaController from "../TapAreaController";

type AreaRangeError = {
  type: "BELOW" | "ABOVE" | "EMPTY",
  requirement?: number
}


export default function TapAreaBoundsDialog(
  { editingAreaIndex, isDialogOpened, setIsDialogOpened, setActiveAreaIndex }:
  {
    editingAreaIndex: number,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
  }) {
  const theme = useTheme();
  const { menuImage, menu: { areas }, setters: { setAreas } } = useContext(EditingRichMenuContext);
  const [bounds, setBounds] = useState<(number | boolean)[]>([-1, -1, -1, -1, false]);
  const [boundsRangeError, setBoundsRangeError] = useState<(AreaRangeError)[]>([null, null, null, null]);
  const [isBoundsPosAbsolute, setBoundsAreaPosAbsolute] = useState(false);
  const detectAreaRangeError = () => {
    const newBoundsRangeError = [...boundsRangeError];
    const numBounds = bounds as number[];
    bounds.forEach((value, index) => {
      if (index >= 4) return;
      const minValue = [0, 0, 0, 0] as number[];
      const maxValue = [
        menuImage?.image.width ?? 0,
        menuImage?.image.height ?? 0,
        menuImage?.image.width - numBounds[0] ?? 0,
        menuImage?.image.height - numBounds[1] ?? 0
      ] as number[];
      if (maxValue[index] < value) {
        newBoundsRangeError[index] = {
          type: "ABOVE",
          requirement: maxValue[index]
        };
      } else if (value < minValue[index]) {
        newBoundsRangeError[index] = {
          type: "BELOW",
          requirement: minValue[index]
        };
      } else if (Number.isNaN(value)) {
        newBoundsRangeError[index] = { type: "EMPTY" };
      } else {
        newBoundsRangeError[index] = null;
      }
      if (newBoundsRangeError[index]?.requirement < 0) newBoundsRangeError[index] = null;
    });
    setBoundsRangeError(newBoundsRangeError);
  };
  const setBoundsPos = (index: number, value: number) => {
    const newBounds = [...bounds] as number[];
    newBounds[index] = value;
    if (!Number.isNaN(value) && isBoundsPosAbsolute && index <= 1) {
      newBounds[index + 2] = newBounds[index + 2] - (newBounds[index] - (bounds[index] as number));
    }
    setBounds([...newBounds, true]);
    detectAreaRangeError();
  };
  const boundsInputProps: InputProps = {
    inputMode: "numeric",
    endAdornment: (<InputAdornment position="end">px</InputAdornment>)
  };
  const boundsPosAlias = (index: number) => (isBoundsPosAbsolute ? ["左上X座標", "左上Y座標", "右下X座標", "右下Y座標"] : ["起点X座標", "起点Y座標", "幅", "高さ"])[index];
  useEffect(() => {
    if (bounds[4]) detectAreaRangeError();
    else if (boundsRangeError.some(v => v !== null)) setBoundsRangeError([null, null, null, null]);
  }, [bounds, isBoundsPosAbsolute]);
  useEffect(() => {
    if (isDialogOpened) {
      if (editingAreaIndex < areas.length) {
        const { x, y, width, height } = areas[editingAreaIndex].bounds;

        setBounds([x, y, width, height, true]);
      } else {
        setBounds([-1, -1, -1, -1, false]);
      }
    }
  }, [areas, editingAreaIndex, isDialogOpened]);
  return (
    <Dialog onClose={() => setIsDialogOpened(false)} onBackdropClick={() => {
      setIsDialogOpened(false);
      setTimeout(() => {
        setBounds([-1, -1, -1, -1, false]);
      }, 100);
    }} open={isDialogOpened} scroll="body" maxWidth="md">
      <DialogTitle>タップ領域を{editingAreaIndex < areas.length ? "編集" : "追加"}</DialogTitle>
      <DialogContent sx={{ width: "688px" }}>
        <Typography variant="subtitle1">画像サイズ: {menuImage?.image.width}px × {menuImage?.image.height}px</Typography>
        <Stack direction="row" alignItems="flex-end" spacing={2} sx={{ mb: 1 }}>
          <FormControl sx={{ flex: 1 }} error={Boolean(boundsRangeError[0])}>
            <InputLabel>{boundsPosAlias(0)}</InputLabel>
            <Input
              value={Number.isNaN(bounds[0]) ? "" : bounds[0]}
              onChange={e => setBoundsPos(0, parseInt(e.target.value))}
              inputProps={{
                pattern: "[0-9]*",
                maxLength: menuImage?.image.width.toString().length
              }}
              {...boundsInputProps}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={Boolean(boundsRangeError[1])}>
            <InputLabel>{boundsPosAlias(1)}</InputLabel>
            <Input
              value={Number.isNaN(bounds[1]) ? "" : bounds[1]}
              onChange={e => setBoundsPos(1, parseInt(e.target.value))}
              inputProps={{
                pattern: "[0-9]*",
                maxLength: menuImage?.image.height.toString().length
              }}
              {...boundsInputProps}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={Boolean(boundsRangeError[2])}>
            <InputLabel>{boundsPosAlias(2)}</InputLabel>
            <Input
              value={Number.isNaN(bounds[2]) ? "" : (bounds[2] as number) + (isBoundsPosAbsolute ? (bounds[0] as number) : 0)}
              onChange={e => setBoundsPos(2, (parseInt(e.target.value)) - (isBoundsPosAbsolute ? (bounds[0] as number) : 0))}
              inputProps={{
                pattern: "[0-9]*",
                maxLength: menuImage?.image.width.toString().length
              }}
              {...boundsInputProps}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={Boolean(boundsRangeError[3])}>
            <InputLabel>{boundsPosAlias(3)}</InputLabel>
            <Input
              value={Number.isNaN(bounds[3]) ? "" : (bounds[3] as number) + (isBoundsPosAbsolute ? (bounds[1] as number) : 0)}
              onChange={e => setBoundsPos(3, (parseInt(e.target.value)) - (isBoundsPosAbsolute ? (bounds[1] as number) : 0))}
              inputProps={{
                pattern: "[0-9]*",
                maxLength: menuImage?.image.height.toString().length
              }}
              {...boundsInputProps}
            /></FormControl>
          <FormControl>
            <Tooltip title={isBoundsPosAbsolute ? "座標で指定" : "サイズで指定"}>
              <Button onClick={() => { setBoundsAreaPosAbsolute(!isBoundsPosAbsolute); }}>
                {isBoundsPosAbsolute ? ("座標") : ("サイズ")}
              </Button>
            </Tooltip>
          </FormControl>
          <FormControl>
            <Tooltip title="領域をリセット">
              <IconButton onClick={() => { setBounds([0, 0, menuImage?.image.width, menuImage?.image.height, true]); }}>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </FormControl>
        </Stack>
        <TapAreaController {...{
          menuImage,
          bounds,
          setBounds
        }} />
        {
          boundsRangeError.some(error => error) && (<Alert severity="error" sx={{ mt: 1 }}>
            <AlertTitle>エラー</AlertTitle>
            {boundsRangeError.map((error, i) => error &&
              (<li key={i}>
                <strong>{boundsPosAlias(i)}</strong>を
                {error.type === "EMPTY" ? "指定" : (<>
                  <strong>{error.requirement + ((i >= 2 && isBoundsPosAbsolute) ? (bounds[i - 2] as number) : 0)}px
                    {error.type === "ABOVE" ? "以下" : "以上"}</strong>に
                </>)}
                してください
              </li>)
            )}
          </Alert>)
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setIsDialogOpened(false);
          setTimeout(() => {
            setBounds([-1, -1, -1, -1, false]);
          }, 100);
        }} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newAreas = [...areas];
          if (!newAreas[editingAreaIndex]) {
            newAreas[editingAreaIndex] = {
              bounds: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
              },
              action: {
                type: "",
                data: ""
              }
            };
          }
          const newBounds = newAreas[editingAreaIndex].bounds;
          ([newBounds.x, newBounds.y, newBounds.width, newBounds.height] = bounds.slice(0, 4) as number[]);
          setAreas(newAreas);
          setActiveAreaIndex(editingAreaIndex);
          setIsDialogOpened(false);
          setTimeout(() => {
            setBounds([-1, -1, -1, -1, false]);
          }, 100);
        }} disabled={boundsRangeError.some(error => error)}
        variant="text">保存</Button>
      </DialogActions>
    </Dialog>
  );
}
