import React, { useContext, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { actionTypes } from "constants/RichMenuAction";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";

import TapAreaActionDialog from "../dialogs/TapAreaActionDialog";
import TapAreaBoundsDialog from "../dialogs/TapAreaBoundsDialog";
import TapAreaBulkCreateDialog from "../dialogs/TapAreaBulkCreateDialog";
import TapAreaBulkDeleteDialog from "../dialogs/TapAreaBulkDeleteDialog";
import TapAreaDeleteDialog from "../dialogs/TapAreaDeleteDialog";

export default function TapAreaSettingsPanel(
  { activeAreaIndex, setActiveAreaIndex }:
  {
    activeAreaIndex: number,
    setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
  }) {
  const theme = useTheme();
  const { menuImage, menu: { areas }, setters: { setAreas } } = useContext(EditingRichMenuContext);
  const [editingAreaIndex, setEditingAreaIndex] = useState(0);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isBoundsDialogOpen, setIsBoundsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState<[boolean, boolean]>([false, false]);
  const mqUpXL = useMediaQuery(theme.breakpoints.up("xl"));
  const mqOnlyMD = useMediaQuery(theme.breakpoints.only("md"));
  const isAreaActionButtonWrapped = !(mqUpXL || mqOnlyMD);
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          タップ領域
          <Box display="inline-flex" columnGap={2} mt={-1} ml={2}>
            {(() => {
              const addAreaButtons = <>
                <Tooltip
                  disableHoverListener={Boolean(menuImage && menuImage.image && areas.length < 20)}
                  title={(() => {
                    if (!(menuImage && menuImage.image)) return "画像を先に選択してください";
                    if (areas.length === 20) return "領域を20個以上設定することはできません";
                  })()}>
                  <span>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingAreaIndex(areas.length);
                        setIsBoundsDialogOpen(true);
                      }}
                      disabled={!(menuImage && menuImage.image && areas.length < 20)}>領域を1つ追加</Button>
                  </span>
                </Tooltip>
                <Tooltip
                  disableHoverListener={Boolean(menuImage && menuImage.image)}
                  title="画像を先に選択してください">
                  <span>
                    <Button
                      startIcon={<CalendarViewMonthIcon />}
                      onClick={() => {
                        if (areas.length > 0) setIsBulkDeleteDialogOpen([true, true]);
                        else setIsBulkCreateDialogOpen(true);
                      }}
                      disabled={!(menuImage && menuImage.image)}>領域をまとめて設定</Button>
                  </span>
                </Tooltip>
              </>;

              return addAreaButtons;
            })()}
            <Tooltip disableHoverListener={areas.length > 0} title="領域が設定されていません">
              <span>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setIsBulkDeleteDialogOpen([true, false]);
                  }}
                  disabled={areas.length === 0}>領域をすべて削除</Button>
              </span>
            </Tooltip>
          </Box>
        </Typography>
        <List sx={{ pb: 0 }}>
          {
            areas.map((area, index) => {
              const areaActionButtons = index => (
                <Stack direction="row" spacing={2}>
                  <Button onClick={e => {
                    e.stopPropagation();
                    setActiveAreaIndex(index);
                    setEditingAreaIndex(index);
                    setIsBoundsDialogOpen(true);
                  }}
                  variant="text">
                    領域を編集
                  </Button>
                  <Button onClick={e => {
                    e.stopPropagation();
                    setActiveAreaIndex(index);
                    setEditingAreaIndex(index);
                    setIsActionDialogOpen(true);
                  }}
                  variant="text">
                    アクションを編集
                  </Button>
                  <Button color="error"
                    onClick={e => {
                      e.stopPropagation();
                      if (e.shiftKey) {
                        const newAreas = [...areas];
                        newAreas.splice(index, 1);
                        setActiveAreaIndex(null);
                        setAreas(newAreas);
                      } else {
                        setActiveAreaIndex(index);
                        setEditingAreaIndex(index);
                        setIsDeleteDialogOpen(true);
                      }
                    }}
                    variant="text">
                    削除
                  </Button>
                </Stack>);
              return (
                <React.Fragment key={index}>
                  <ListItemButton dense
                    selected={activeAreaIndex === index}
                    onClick={() => activeAreaIndex === index ? setActiveAreaIndex(null) : setActiveAreaIndex(index)}
                  >
                    <ListItem
                      secondaryAction={!isAreaActionButtonWrapped && areaActionButtons(index)}
                    >
                      <ListItemText
                        primary={(() => {
                          if (area.action.type === "") {
                            if (area.action.label) return `${area.action.label} (アクション未設定)`;
                            return "アクション未設定";
                          }
                          if (area.action.label) return `${area.action.label} (${actionTypes[area.action.type].label}アクション)`;
                          return `${actionTypes[area.action.type].label}アクション`;
                        })()}
                        secondary={`X: ${area.bounds.x}px Y: ${area.bounds.y}px W: ${area.bounds.width}px H: ${area.bounds.height}px`} />
                    </ListItem>
                  </ListItemButton>
                  {isAreaActionButtonWrapped && <ListItem>{areaActionButtons(index)}</ListItem>}
                  <Divider />
                </React.Fragment>
              );
            })}
        </List>
        {(() => {
          const dialogCommonProps = { editingAreaIndex };
          return (
            <>
              <TapAreaActionDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpen: isActionDialogOpen,
                  setIsDialogOpen: setIsActionDialogOpen
                }} />
              <TapAreaBoundsDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpen: isBoundsDialogOpen,
                  setIsDialogOpen: setIsBoundsDialogOpen,
                  setActiveAreaIndex
                }} />
              <TapAreaDeleteDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpen: isDeleteDialogOpen,
                  setIsDialogOpen: setIsDeleteDialogOpen,
                  setActiveAreaIndex
                }} />
              <TapAreaBulkCreateDialog {
                ...{
                  isDialogOpen: isBulkCreateDialogOpen,
                  setIsDialogOpen: setIsBulkCreateDialogOpen
                }} />
              <TapAreaBulkDeleteDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpen: isBulkDeleteDialogOpen,
                  setIsDialogOpen: setIsBulkDeleteDialogOpen,
                  onDeleted() {
                    if (isBulkDeleteDialogOpen[1]) setIsBulkCreateDialogOpen(true);
                  }
                }} />
            </>
          );
        })()}
      </CardContent>
    </Card>
  );
}
