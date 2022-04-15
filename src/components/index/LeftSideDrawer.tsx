import { RichMenuResponse } from "@line/bot-sdk";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";
import { BotAccount, BotAccountContext } from "contexts/BotAccountContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import botAccountDatabase from "databases/BotAccount";
import richMenuDatabase from "databases/RichMenu";
import React, { useContext, useEffect, useState } from "react";
import BotDeleteDialog from "./dialogs/BotDeleteDialog";
import RichMenuDeleteDialog from "./dialogs/RichMenuDeleteDialog";
import RichMenuExportDialog from "./dialogs/RichMenuExportDialog";
import RichMenuImportDialog from "./dialogs/RichMenuImportDialog";

export default function LeftSideDrawer(
  { setIsBotSettingsDialogOpen }: { setIsBotSettingsDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }
) {
  const theme = useTheme();
  const { accounts: _accounts, setAccounts: _setAccounts, setEditingBotId } = useContext(BotAccountContext);
  const { richMenuId: editingRichMenuId, menu: editingRichMenu, reset: resetRichMenu, loadFromDB: loadRichMenuFromDB }
    = useContext(EditingRichMenuContext);
  const [contextMenu, setContextMenu] = useState<{
    type: "menu" | "bot";
    mouseX: number;
    mouseY: number;
    target: string;
  } | null>(null);
  const [isRichMenuDeleteDialogOpened, setIsRichMenuDeleteDialogOpened] = useState(false);
  const [isBotDeleteDialogOpened, setIsBotDeleteDialogOpened] = useState(false);
  const [isRichMenuImportDialogOpened, setIsRichMenuImportDialogOpened] = useState(false);
  const [isRichMenuExportDialogOpened, setIsRichMenuExportDialogOpened] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    const findTarget = (target: HTMLElement) => {
      if (target.dataset.target) return target.dataset.target;
      if (target.parentElement) {
        if (target.parentElement.classList.contains("MuiCollapse-vertical")) return findTarget(target.parentElement);
        return findTarget(target.parentElement);
      }
      return null;
    };
    const target = findTarget(event.target as HTMLElement);
    if (!(target || (event.target as HTMLElement).classList.contains("MuiBackdrop-root"))) return;
    event.preventDefault();
    setContextMenu(
      contextMenu === null ? {
        type: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$|^richmenu-/i.test(target) ? "menu" : "bot",
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        target
      } : null
    );
  };
  const handleMenuClose = () => {
    setContextMenu(null);
  };
  const [accounts, setAccounts] = useState<(Weaken<BotAccount, "richMenus"> & { isOpened: boolean, richMenus: RichMenuResponse[] })[]>([]);
  useEffect(() => {
    (async () => {
      const accounts = await botAccountDatabase.accounts.toArray();
      const newAccounts = [];
      await Promise.allSettled(accounts.map(async account => {
        const result = await axios.get("https://cors.e-chan1007.workers.dev/api.line.me/v2/bot/info", { headers: { Authorization: `Bearer ${account.channelAccessToken}` }}).catch(({ response }) => response);
        if (result.status === 200) {
          const newAccount = {
            ...account,
            basicId: result.data.basicId,
            botName: result.data.displayName,
            channelAccessToken: account.channelAccessToken,
            pictureUrl: result.data.pictureUrl
          };
          newAccounts.push(newAccount);
        }
      }));
      _setAccounts(newAccounts);
    })();
  }, []);
  useEffect(() => {
    setTimeout(async () => {
      setAccounts((await Promise.all(_accounts.map(async (account, i) => ({
        ...account,
        isOpened: (accounts[i]?.isOpened || account.richMenus.includes(editingRichMenuId)),
        richMenus: (await richMenuDatabase.menus.where("richMenuId").anyOf(account.richMenus).toArray())
          .map(({ richMenuId, menu }): RichMenuResponse => ({ ...menu, richMenuId }))
          .sort(({ richMenuId: a }, { richMenuId: b }) => (
            account.richMenus.indexOf(a) - account.richMenus.indexOf(b)
          ))
      })))).sort(({ botName: a }, { botName: b }) => a.localeCompare(b)));
    }, 16);
  }, [_accounts, editingRichMenu, editingRichMenuId]);


  /* const { data: remoteRichMenuList } = useSWR<{richmenus: {[key: string]: string}[]}>(() => {
    const channelAccessToken = accounts.find(({ isOpened }) => isOpened)?.channelAccessToken;
    if (channelAccessToken) return `https://cors.e-chan1007.workers.dev/api.line.me/v2/bot/richmenu/list`;
    return null;
  }, url => axios.get(url, { headers: { Authorization: `Bearer ${accounts.find(({ isOpened }) => isOpened)?.channelAccessToken}` } }).then(({ data }) => data), { dedupingInterval: 1000 }); */

  const createNewRichMenu = (account: BotAccount) => {
    const newRichMenuId = resetRichMenu() as string;
    const newAccounts = [..._accounts];
    newAccounts.splice(
      newAccounts.findIndex(({ basicId }) => basicId === account.basicId),
      1,
      { ...account, richMenus: [...account.richMenus, newRichMenuId] }
    );
    _setAccounts(newAccounts);
    setEditingBotId(account.basicId);
  };

  return <>
    <List sx={{ paddingBottom: "0px" }} onContextMenu={handleContextMenu}>
      <Box display="flex" flexDirection="column">
        <ListSubheader component="div" sx={{ background: "transparent" }}>
          リッチメニュー一覧
        </ListSubheader>
        {accounts.map((account, i) => (
          <div key={`${i}`} data-target={`${account.basicId}`}>
            <ListItem secondaryAction={
              <Tooltip title="新しいリッチメニュー">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => { createNewRichMenu(_accounts.find(({ basicId }) => basicId === account.basicId)); }}
                  size="large">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            } disablePadding>
              <ListItemButton onClick={() => {
                setAccounts(accounts.map(vAccount => {
                  if (account === vAccount) return { ...account, isOpened: !account.isOpened };
                  else return vAccount;
                }));
              }}
              selected={account.richMenus.some(({ richMenuId }) => richMenuId === editingRichMenuId)}>
                {account.pictureUrl ? (
                  <ListItemAvatar sx={{ width: 24 }}>
                    <Avatar src={account.pictureUrl} sx={{ width: 24, height: 24 }} />
                  </ListItemAvatar>
                ) : (
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                )}
                <ListItemText primary={`${account?.botName}`} />
                {account.isOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            <Collapse in={account.isOpened} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                {account.richMenus.map((richMenu, i) => (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    key={i}
                    selected={editingRichMenuId === richMenu.richMenuId}
                    onClick={() => {
                      loadRichMenuFromDB(richMenu.richMenuId);
                      setEditingBotId(account.basicId);
                    }}
                    data-target={richMenu.richMenuId}>
                    <ListItemText primary={richMenu.name || "(名称未設定のリッチメニュー)"} secondary={richMenu.richMenuId.startsWith("richmenu-") ? richMenu.richMenuId.slice(0, 24) + "..." : "(未アップロード)"} />
                  </ListItemButton>
                ))}
                {account.richMenus.length === 0 && (
                  <ListItem><ListItemText primary="リッチメニューはありません" /></ListItem>
                )}
              </List>
            </Collapse>
          </div>
        ))}
        <ListItemButton sx={{ pl: 4, my: 2 }} onClick={() => setIsBotSettingsDialogOpen(true)}>
          <ListItemText primary="Botアカウントを追加" />
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ pl: 4 }} dense component="a" href="https://e-chan1007.notion.site/a566a179f3db4e78b1ae883be23aad38" target="_blank" rel="noopener noreferrer">
          <ListItemText primary="エディタについて" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }} dense component="a" href="https://e-chan1007.notion.site/66731af48ed34b77a68279c6fdd39374" target="_blank" rel="noopener noreferrer">
          <ListItemText primary="プライバシーポリシー" />
        </ListItemButton>
      </Box>
      <Menu
        open={contextMenu !== null && contextMenu.type === "bot"}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : null
        }
      >
        <MenuItem onClick={() => {
          createNewRichMenu(_accounts.find(({ basicId }) => basicId === contextMenu.target));
          handleMenuClose();
        }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>新しいリッチメニュー</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setIsRichMenuImportDialogOpened(true); }}>
          <ListItemIcon>
            <DriveFileMoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>リッチメニューをインポート</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setIsBotDeleteDialogOpened(true); }} >
          <ListItemIcon>
            <DeleteIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.error.main }}>Botを削除</ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        open={contextMenu !== null && contextMenu.type === "menu"}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : null
        }
      >
        {contextMenu?.target?.startsWith?.("richmenu-") && (<>
          <MenuItem onClick={() => { navigator.clipboard.writeText(contextMenu.target); handleMenuClose(); }}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>リッチメニューのIDをコピー</ListItemText>
          </MenuItem>
        </>
        )}
        <MenuItem onClick={() => { setIsRichMenuExportDialogOpened(true); }}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ファイルとして出力</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setIsRichMenuDeleteDialogOpened(true); }}>
          <ListItemIcon>
            <DeleteIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.error.main }}>リッチメニューを削除</ListItemText>
        </MenuItem>
      </Menu>
    </List>

    <RichMenuDeleteDialog
      isDialogOpened={isRichMenuDeleteDialogOpened}
      setIsDialogOpened={setIsRichMenuDeleteDialogOpened}
      richMenuId={contextMenu?.target}
      handleMenuClose={handleMenuClose} />
    <RichMenuImportDialog
      isDialogOpened={isRichMenuImportDialogOpened}
      setIsDialogOpened={setIsRichMenuImportDialogOpened}
      botId={contextMenu?.target}
      handleMenuClose={handleMenuClose} />
    <RichMenuExportDialog
      isDialogOpened={isRichMenuExportDialogOpened}
      setIsDialogOpened={setIsRichMenuExportDialogOpened}
      richMenuId={contextMenu?.target}
      handleMenuClose={handleMenuClose} />
    <BotDeleteDialog
      isDialogOpened={isBotDeleteDialogOpened}
      setIsDialogOpened={setIsBotDeleteDialogOpened}
      botId={contextMenu?.target}
      handleMenuClose={handleMenuClose} />
  </>;
}
