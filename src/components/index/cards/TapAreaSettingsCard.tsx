import { List } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import { actionTypes } from "constants/RichMenuAction";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext, useState } from "react";
import TapAreaActioonDialog from "../dialogs/TapAreaActionDialog";
import TapAreaBoundsDialog from "../dialogs/TapAreaBoundsDialog";
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
  const [isActionDialogOpened, setIsActionDialogOpened] = useState(false);
  const [isBoundsDialogOpened, setIsBoundsDialogOpened] = useState(false);
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false);
  const mqUpXL = useMediaQuery(theme.breakpoints.up("xl"));
  const mqOnlyMD = useMediaQuery(theme.breakpoints.only("md"));
  const isAreaActionButtonWrapped = !(mqUpXL || mqOnlyMD);
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          タップ領域
          {(() => {
            const addAreaButton = <Button
              sx={{ mx: 2, mt: -1 }}

              startIcon={<AddIcon />}
              onClick={() => {
                setEditingAreaIndex(areas.length);
                setIsBoundsDialogOpened(true);
              }}
              disabled={!(menuImage && menuImage.image && areas.length < 20)}>領域を追加</Button>;
            return (!(menuImage && menuImage.image && areas.length < 20)) ? (
              <Tooltip title={(() => {
                if (!(menuImage && menuImage.image)) return "画像を先に選択してください";
                if (areas.length === 20) return "領域を20個以上設定することはできません";
              })()}>
                <span>
                  {addAreaButton}
                </span>
              </Tooltip>
            ) : addAreaButton;
          })()}
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
                    setIsBoundsDialogOpened(true);
                  }}
                  variant="text">
                    領域を編集
                  </Button>
                  <Button onClick={e => {
                    e.stopPropagation();
                    setActiveAreaIndex(index);
                    setEditingAreaIndex(index);
                    setIsActionDialogOpened(true);
                  }}
                  variant="text">
                    アクションを編集
                  </Button>
                  <Button color="error" onClick={e => {
                    e.stopPropagation();
                    setActiveAreaIndex(index);
                    setEditingAreaIndex(index);
                    setIsDeleteDialogOpened(true);
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
                          if (area.action.label) return `${area.action.label} (${actionTypes[area.action.type].label}アクション)`;
                          else if (area.action.type === "") return "アクション未設定の領域";
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
          const dialogCommonProps = {
            menuImage,
            areas,
            setAreas,
            editingAreaIndex
          };
          return (
            <>
              <TapAreaActioonDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpened: isActionDialogOpened,
                  setIsDialogOpened: setIsActionDialogOpened
                }} />
              <TapAreaBoundsDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpened: isBoundsDialogOpened,
                  setIsDialogOpened: setIsBoundsDialogOpened,
                  setActiveAreaIndex
                }} />
              <TapAreaDeleteDialog {
                ...{
                  ...dialogCommonProps,
                  isDialogOpened: isDeleteDialogOpened,
                  setIsDialogOpened: setIsDeleteDialogOpened,
                  setActiveAreaIndex
                }} />
            </>);
        })()}
      </CardContent>
    </Card>
  );
}
