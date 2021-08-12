import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext } from "react";

export default function BasicSettingsCard(): JSX.Element {
  const { menu: { name, chatBarText, selected }, setters: { setName, setChatBarText, setSelected } } = useContext(EditingRichMenuContext);
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          基本設定
        </Typography>
        <TextField label="メニュー名" margin="dense" fullWidth required inputProps={{ maxLength: 300 }} value={name} onChange={e => setName(e.target.value)} />
        <TextField label="開閉ボタンのテキスト" margin="dense" fullWidth required inputProps={{ maxLength: 14 }} value={chatBarText} onChange={e => setChatBarText(e.target.value)}/>
        <FormControlLabel control={<Checkbox checked={selected} onChange={e => setSelected(e.target.checked)} />} label="デフォルトでメニューを表示する" sx={{ mt: 1 }}/>
      </CardContent>
    </Card>
  );
}
