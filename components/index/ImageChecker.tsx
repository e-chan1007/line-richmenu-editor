import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import DescriptionIcon from "@mui/icons-material/Description";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext } from "react";

const LIMIT_FILE_SIZE = 1; // MB
const LIMIT_MIN_WIDTH = 800; // px
const LIMIT_MIN_HEIGHT = 250; // px
const LIMIT_MAX_WIDTH = 2500; // px
const LIMIT_MAX_HEIGHT = 1724; // px
const LIMIT_ASPECT_RATIO = 1.45;

export default function ImageChecker() {
  const { menuImage } = useContext(EditingRichMenuContext);
  const theme = useTheme();
  return menuImage ? (
    <>
      {
        menuImage.fileType ?(
          <Alert severity="success" sx={{ borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" }}>
            フォーマット: JPEG または PNG ({menuImage.fileType})
          </Alert>
        ):(
          <Alert severity="error" sx={{ borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" }}>
            フォーマット: JPEG または PNG
          </Alert>
        )
      }
      {
        menuImage.fileSize <= LIMIT_FILE_SIZE * 1024 ?(
          <Alert severity="success" sx={{ borderRadius: "0px" }}>
            最大ファイルサイズ: {LIMIT_FILE_SIZE}MB ({menuImage.fileSize}KB)
          </Alert>
        ):(
          <Alert severity="error" sx={{ borderRadius: "0px" }}>
            最大ファイルサイズ: {LIMIT_FILE_SIZE}MB (<span style={{ fontWeight: "bold" }}>{(menuImage.fileSize / 1024).toFixed(3)}MB</span>)
          </Alert>
        )
      }
      {
        menuImage.image ?(
          <>
            <Alert severity={menuImage.image.width >= LIMIT_MIN_WIDTH && menuImage.image.height >= LIMIT_MIN_HEIGHT ? "success" : "error"} sx={{ borderRadius: "0px" }}>
              最小画像サイズ: {LIMIT_MIN_WIDTH}px&nbsp;×&nbsp;{LIMIT_MIN_HEIGHT}px
              (
              <span style={{ fontWeight: menuImage.image.width < LIMIT_MIN_WIDTH ? "bold" : "normal" }}>{menuImage.image.width}px</span>&nbsp;×&nbsp;
              <span style={{ fontWeight: menuImage.image.height < LIMIT_MIN_HEIGHT ? "bold" : "normal" }}>{menuImage.image.height}px</span>
              )
            </Alert>
            <Alert severity={menuImage.image.width <= LIMIT_MAX_WIDTH && menuImage.image.height <= LIMIT_MAX_HEIGHT ? "success" : "error"} sx={{ borderRadius: "0px" }}>
              最大画像サイズ: {LIMIT_MAX_WIDTH}px&nbsp;×&nbsp;{LIMIT_MAX_HEIGHT}px
              (
              <span style={{ fontWeight: menuImage.image.width > LIMIT_MAX_WIDTH ? "bold" : "normal" }}>{menuImage.image.width}px</span>&nbsp;×&nbsp;
              <span style={{ fontWeight: menuImage.image.height > LIMIT_MAX_HEIGHT ? "bold" : "normal" }}>{menuImage.image.height}px</span>
              )
            </Alert>
            <Alert severity={menuImage.image.width / menuImage.image.height >= LIMIT_ASPECT_RATIO ? "success" : "error"} sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
              画像アスペクト比(幅÷高さ): {LIMIT_ASPECT_RATIO}以上 (<span style={{ fontWeight: menuImage.image.width / menuImage.image.height < LIMIT_ASPECT_RATIO ? "bold" : "normal" }}>{(menuImage.image.width / menuImage.image.height).toFixed(3)}</span>)
            </Alert>
          </>
        ):(
          <>
            <Alert severity="error" sx={{ borderRadius: "0px" }}>
              最小画像サイズ: {LIMIT_MIN_WIDTH}px&nbsp;×&nbsp;{LIMIT_MIN_HEIGHT}px
            </Alert>
            <Alert severity="error" sx={{ borderRadius: "0px" }}>
              最大画像サイズ: {LIMIT_MAX_WIDTH}px&nbsp;×&nbsp;{LIMIT_MAX_HEIGHT}px
            </Alert>
            <Alert severity="error" sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
              画像アスペクト比(幅÷高さ): {LIMIT_ASPECT_RATIO}以上
            </Alert>
          </>
        )
      }
    </>
  ) : (
    <>
      <Alert
        severity="info"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px"
        }}
        icon={<DescriptionIcon sx={{ color: theme.palette.text.secondary }}/>}>
        フォーマット: JPEG または PNG
      </Alert>
      <Alert
        severity="info"
        sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: "0px" }}
        icon={<DescriptionOutlinedIcon sx={{ color: theme.palette.text.secondary }}/>}>
        最大ファイルサイズ: {LIMIT_FILE_SIZE}MB
      </Alert>
      <Alert
        severity="info"
        sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: "0px" }}
        icon={<PhotoSizeSelectLargeIcon sx={{ color: theme.palette.text.secondary }}/>}>
        最小画像サイズ: {LIMIT_MIN_WIDTH}px&nbsp;×&nbsp;{LIMIT_MIN_HEIGHT}px
      </Alert>
      <Alert
        severity="info"
        sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: "0px" }}
        icon={<PhotoSizeSelectActualIcon sx={{ color: theme.palette.text.secondary }}/>}>
        最大画像サイズ: {LIMIT_MAX_WIDTH}px&nbsp;×&nbsp;{LIMIT_MAX_HEIGHT}px
      </Alert>
      <Alert
        severity="info"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px"
        }}
        icon={<AspectRatioIcon sx={{ color: theme.palette.text.secondary }}/>}>
        画像アスペクト比(幅÷高さ): {LIMIT_ASPECT_RATIO}以上
      </Alert>
    </>
  );
}
