import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext, useMemo, useRef, useState } from "react";
import styles from "styles/TapAreaBulkCreateDialog.module.scss";
import { Area } from "types/RichMenu";

export default function TapAreaBulkCreateDialog(
  { isDialogOpen, setIsDialogOpen }:
  {
    isDialogOpen: boolean,
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const viewWidth = 640;
  const { menuImage, menu: { areas }, setters: { setAreas }} = useContext(EditingRichMenuContext);

  const viewHeight = useMemo(() => menuImage?.image
    ? menuImage.image.height * (viewWidth / menuImage.image.width)
    : 0,
  [menuImage, viewWidth]);

  const zenkakuToHankaku = (str: string) => str.replaceAll(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replaceAll("：", ":");

  const [horizontalSplitSettingsBase, setHorizontalSplitSettingsBase] = useState("1");
  const [verticalSplitSettingsBase, setVerticalSplitSettingsBase] = useState("1");

  const [isHorizontalSplitSettingsWrong, setIsHorizontalSplitSettingsWrong] = useState(false);
  const [isVerticalSplitSettingsWrong, setIsVerticalSplitSettingsWrong] = useState(false);

  const horizontalSplitSettings = useMemo<number[]>(() => {
    const base = zenkakuToHankaku(horizontalSplitSettingsBase);
    if (!/^(\d+:)+\d+$|^\d{1,2}$/.test(base)) {
      setIsHorizontalSplitSettingsWrong(true);
      return [];
    }
    setIsHorizontalSplitSettingsWrong(false);
    let parsedValue: number[] = [];
    if (/^\d+$/.test(base)) parsedValue = new Array(parseInt(base)).fill(1);
    else parsedValue = base.split(":").map(v => parseInt(v));
    const sum = parsedValue.reduce((prev, cur) => prev + cur, 0);
    const widthList = parsedValue.map(v => v / sum).filter(v => v !== 0);
    return widthList;
  }, [horizontalSplitSettingsBase, viewWidth]);

  const verticalSplitSettings = useMemo<number[]>(() => {
    const base = zenkakuToHankaku(verticalSplitSettingsBase);
    if (!/^(\d+:)+\d+$|^\d{1,2}$/.test(base)) {
      setIsVerticalSplitSettingsWrong(true);
      return [];
    }
    setIsVerticalSplitSettingsWrong(false);
    let parsedValue: number[] = [];
    if (/^\d+$/.test(base)) parsedValue = new Array(parseInt(base)).fill(1);
    else parsedValue = base.split(":").map(v => parseInt(v));
    const sum = parsedValue.reduce((prev, cur) => prev + cur, 0);
    const heightList = parsedValue.map(v => v / sum).filter(v => v !== 0);
    return heightList;
  }, [verticalSplitSettingsBase, viewHeight]);

  const areBoundsTooMuch = useMemo(
    () => horizontalSplitSettings.length * verticalSplitSettings.length > 20,
    [horizontalSplitSettings, verticalSplitSettings]
  );

  const menuImageRef = useRef<HTMLImageElement>();

  return (
    <Dialog onClose={() => setIsDialogOpen(false)} onBackdropClick={() => {
      setIsDialogOpen(false);
      setTimeout(() => {
        setHorizontalSplitSettingsBase("1");
        setVerticalSplitSettingsBase("1");
      }, 100);
    }} open={isDialogOpen} scroll="body" maxWidth="md">
      <DialogTitle>タップ領域をまとめて設定</DialogTitle>
      <DialogContent sx={{ width: "688px" }}>
        <Typography variant="subtitle1">画像サイズ: {menuImage?.image.width}px × {menuImage?.image.height}px</Typography>
        <p>分割数を整数(最大20)で指定することも、比(2:1など)で指定することもできます。</p>
        <Stack direction="row" alignItems="flex-end" spacing={2} sx={{ mb: 1 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>横の分割設定</InputLabel>
            <Input
              value={horizontalSplitSettingsBase}
              onChange={e => setHorizontalSplitSettingsBase(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>縦の分割設定</InputLabel>
            <Input
              value={verticalSplitSettingsBase}
              onChange={e => setVerticalSplitSettingsBase(e.target.value)}
            />
          </FormControl>
        </Stack>
        <div className={styles["bounds-grid-wrapper"]}>
          <img ref={menuImageRef} src={menuImage?.image.src} width={viewWidth} />
          { !(isHorizontalSplitSettingsWrong || isVerticalSplitSettingsWrong || areBoundsTooMuch) && (
            <table className={[styles["bounds-grid"], styles[horizontalSplitSettings.length % 2 === 0 ? "is-2n" : "is-2n-1"]].join(" ")} style={{ height: viewHeight }}>
              <tbody>
                {
                  verticalSplitSettings.map((heightSetting, i) =>
                    <tr style={{ height: viewHeight * heightSetting }} key={i} className={styles[i % 2 === 0 ? "row-2n": "row-2n-1"]}>
                      { horizontalSplitSettings.map((widthSetting, j) =>
                        <td key={j} style={{ width: viewWidth * widthSetting }}>
                          {
                            (viewHeight * heightSetting >= 32 && viewWidth * widthSetting >= 32)
                            && horizontalSplitSettings.length * i + j + 1
                          }
                        </td>
                      )}
                    </tr>
                  )
                }
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setIsDialogOpen(false);
          setTimeout(() => {
            setHorizontalSplitSettingsBase("1");
            setVerticalSplitSettingsBase("1");
          }, 100);
        }} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newAreas: Area[] = [];
          verticalSplitSettings.forEach((verticalSplitSetting, i) => {
            horizontalSplitSettings.forEach((horizontalSplitSetting, j) => {
              newAreas.push({
                bounds: {
                  x: Math.round(menuImage.image.width * horizontalSplitSettings.slice(0, j).reduce((prev, cur) => prev + cur, 0)),
                  y: Math.round(menuImage.image.height * verticalSplitSettings.slice(0, i).reduce((prev, cur) => prev + cur, 0)),
                  width: Math.round(menuImage.image.width * horizontalSplitSetting),
                  height: Math.round(menuImage.image.height * verticalSplitSetting)
                },
                action: {
                  type: "",
                  label: `領域 ${horizontalSplitSettings.length * i + j + 1}`
                }
              });
            });
          });
          setAreas(newAreas);
          setIsDialogOpen(false);
          setTimeout(() => {
            setHorizontalSplitSettingsBase("1");
            setVerticalSplitSettingsBase("1");
          }, 100);
        }}
        variant="text">保存</Button>
      </DialogActions>
    </Dialog>
  );
}
