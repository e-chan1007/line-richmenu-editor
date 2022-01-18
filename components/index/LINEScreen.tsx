import IconButton from "@material-ui/core/IconButton";
import Stack from "@material-ui/core/Stack";
import { useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosNewIcon from "@material-ui/icons/ArrowBackIosNew";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardAltOutlinedIcon from "@material-ui/icons/KeyboardAltOutlined";
import { actionTypes } from "constants/RichMenuAction";
import { BotAccount, BotAccountContext } from "contexts/BotAccountContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import styles from "styles/LINEScreen.module.scss";

export default function LINEScreen(
  { activeAreaIndex, setActiveAreaIndex }:
  {
    activeAreaIndex: number,
    setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
  }
) {
  const theme = useTheme();
  const { menuImage, richMenuId, menu: { areas, chatBarText } } = useContext(EditingRichMenuContext);
  const { accounts, editingBotId } = useContext(BotAccountContext);
  const [messages, setMessages] = useState<{from: "user" | "bot", text: string}[]>([]);
  const [imageScale, setImageScale] = useState(1);
  const [richMenuCursor, setRichMenuCursor] = useState("default");
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const onRichMenuClicked = (event: MouseEvent<HTMLImageElement>) => {
    const posX = (event.clientX - imageRef.current.getBoundingClientRect().left) * imageScale,
      posY = (event.clientY - imageRef.current.getBoundingClientRect().top) * imageScale;
    const clickedArea = areas.find(area =>
      area.bounds.x <= posX && posX <= area.bounds.x + area.bounds.width &&
      area.bounds.y <= posY && posY <= area.bounds.y + area.bounds.height
    );
    if (clickedArea) {
      setActiveAreaIndex(areas.indexOf(clickedArea));
      const newMessages = [...messages];
      if (clickedArea.action.text || clickedArea.action.displayText) newMessages.push({ from: "user", text: clickedArea.action.text || clickedArea.action.displayText });
      if (clickedArea.action.label) newMessages.push({ from: "bot", text: `${clickedArea.action.label}(${actionTypes[clickedArea.action.type].label}アクション)` });
      else newMessages.push({ from: "bot", text: `${actionTypes[clickedArea.action.type] ? actionTypes[clickedArea.action.type].label+ "アクション" : "アクション未設定"}` });
      setMessages(newMessages);
    }
  };
  const onRichMenuHovered = (event: MouseEvent<HTMLImageElement>) => {
    const posX = (event.clientX - imageRef.current.getBoundingClientRect().left) * imageScale,
      posY = (event.clientY - imageRef.current.getBoundingClientRect().top) * imageScale;
    const clickedArea = areas.find(area =>
      area.bounds.x <= posX && posX <= area.bounds.x + area.bounds.width &&
      area.bounds.y <= posY && posY <= area.bounds.y + area.bounds.height
    );
    setRichMenuCursor(clickedArea ? "pointer": "default");
  };
  useEffect(() => {
    setMessages([]);
    setActiveAreaIndex(null);
  }, [editingBotId, richMenuId]);

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chatAreaRef, messages]);
  useEffect(() => {
    setImageScale(imageRef.current.naturalWidth / imageRef.current.width);
  }, [imageRef, menuImage]);

  useEffect(() => {
    const setScale = () => setImageScale(imageRef.current.naturalWidth / imageRef.current.width);
    window.addEventListener("resize", setScale);
    return function cleanup() {
      window.removeEventListener("resize", setScale);
    };
  }, []);
  return (
    <div className={theme.palette.mode === "dark" ? [styles.line, styles["is-dark"]].join(" ") : styles.line}>
      <Toolbar variant="dense" disableGutters sx={{ px: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: "100%" }} alignItems="center">
          <ArrowBackIosNewIcon />
          <Typography sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{accounts.find(({ basicId }) => basicId === editingBotId)?.botName}</Typography>
          <Tooltip title="履歴を削除">
            <IconButton onClick={() => setMessages([])}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      <div className={theme.palette.mode === "dark" ? [styles.line__chatarea, styles["is-dark"]].join(" ") : styles.line__chatarea} ref={chatAreaRef}>
        {messages.map(({ from, text }, i) => (
          <div key={i} className={from === "bot" ? styles.line__chatarea__row : [styles.line__chatarea__row, styles["is-user"]].join(" ")}>
            {(from === "bot" && accounts.find(({ basicId }) => basicId === editingBotId).pictureUrl) && (
              <img
                className={styles.line__chatarea__row__icon}
                src={accounts.find(({ basicId }) => basicId === editingBotId).pictureUrl}
                alt={accounts.find(({ basicId }) => basicId === editingBotId)?.botName} />
            )}
            <div className={from === "bot" ? styles.line__chatarea__row__bubble : [styles.line__chatarea__row__bubble, styles["is-user"]].join(" ")}>
              {text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", marginBottom: "-8px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="リッチメニュー"
          src={menuImage?.image?.src}
          onClick={onRichMenuClicked}
          onMouseMove={onRichMenuHovered}
          style={{ width: "100%", visibility: menuImage?.image?.src ? "visible" : "hidden", cursor: richMenuCursor }}
          ref={imageRef}
          draggable={false} />
        <svg width="100%" height="100%" style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          pointerEvents: "none"
        }}>
          <defs>
            <mask id="outsideBoundsMask2">
              <rect x="0" y="0" width="100%" height="100%" fill="white"/>
              <rect
                style={{ transition: "all ease 0.16s" }}
                x={areas[activeAreaIndex] ? areas[activeAreaIndex].bounds.x / imageScale : 0}
                y={areas[activeAreaIndex] ? areas[activeAreaIndex].bounds.y / imageScale : 0}
                width={areas[activeAreaIndex] ? areas[activeAreaIndex].bounds.width / imageScale: "100%"}
                height={areas[activeAreaIndex] ? areas[activeAreaIndex].bounds.height / imageScale : "100%"}/>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="#00000055"
            mask="url(#outsideBoundsMask2)"/>
        </svg>
      </div>
      <Toolbar variant="dense" sx={{ backgroundColor: theme.palette.mode === "dark" ? "#262626" : "#FFF" }}>
        <Stack direction="row" sx={{ width: "100%" }}>
          <KeyboardAltOutlinedIcon sx={{ mr: 2, color: theme.palette.mode === "dark" ? "#B7B7B7" : "black" }}/>
          <Typography sx={{ flex: 1, textAlign: "center", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
            {chatBarText}
            <ArrowDropDownIcon sx={{ mb: -0.5 }}/>
          </Typography>
        </Stack>
      </Toolbar>
    </div>
  );
}
