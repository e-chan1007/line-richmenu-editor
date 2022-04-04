import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { ChangeEvent, useContext } from "react";
import ImageChecker from "../ImageChecker";

const JPEG_HEADER = "/9j";
const PNG_HEADER = "iVBORw0KGgo";

export default function ImageSelectCard() {
  const { setters: { setMenuImage, setSize }} = useContext(EditingRichMenuContext);
  const theme = useTheme();
  const onImageSelected = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = (event.target.files as FileList)[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const base64Binary = (fileReader.result as string).split(",", 2)[1];
      let fileType: "JPEG" | "PNG" | undefined;
      if (base64Binary.startsWith(JPEG_HEADER)) fileType = "JPEG";
      else if (base64Binary.startsWith(PNG_HEADER)) fileType = "PNG";
      const fileData = {
        fileName: file.name,
        fileSize: Math.floor(file.size / 1024),
        fileType
      };
      if (fileType) {
        const image = new Image();
        image.onload = () => {
          setMenuImage({
            ...fileData,
            image
          });
          setSize({ width: image.width, height: image.height });
        };
        image.src = fileReader.result as string;
        image.onerror = () => {
          setMenuImage({ ...fileData });
        };
      } else {
        setMenuImage({ ...fileData });
      }
    };
    fileReader.readAsDataURL(file);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          画像設定
          <label style={{ margin: theme.spacing(2) }}>
            <input accept=".jpg,.jpeg,.png" type="file" style={{ display: "none" }} onChange={onImageSelected} />
            <Button startIcon={<FolderOpenIcon />} component="span" sx={{ mt: -1 }}>
              画像を選択
            </Button>
          </label>
        </Typography>
        <div style={{ margin: theme.spacing(2, 0, 0, 0) }}>
          <ImageChecker />
        </div>
      </CardContent>
    </Card>
  );
}
