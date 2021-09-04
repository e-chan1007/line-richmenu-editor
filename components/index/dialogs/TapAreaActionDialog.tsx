import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Stack from "@material-ui/core/Stack";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { LocalizationProvider } from "@material-ui/lab";
import AdapterDayjs from "@material-ui/lab/AdapterDayjs";
import DatePicker from "@material-ui/lab/DatePicker";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import TimePicker from "@material-ui/lab/TimePicker";
import { actionTypes } from "constants/RichMenuAction";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import dayjs from "dayjs";
import jaLocale from "dayjs/locale/ja";
import React, { useContext, useEffect, useState } from "react";
import { Action } from "types/RichMenu";
import TapAreaController from "../TapAreaController";

export default function TapAreaActionDialog(
  { editingAreaIndex, isDialogOpened, setIsDialogOpened }:
  {
    editingAreaIndex: number,
    isDialogOpened: boolean,
    setIsDialogOpened: React.Dispatch<React.SetStateAction<boolean>>
  })
  : JSX.Element {
  const { menuImage, menu: { areas }, setters: { setAreas } } = useContext(EditingRichMenuContext);
  const [bounds, setBounds] = useState<(number|boolean)[]>([]);
  const [action, setAction] = useState<Action>({ } as Action);
  const setActionProp = (key: string, value: unknown) => {
    setAction({ ...action, [key]: value });
  };
  useEffect(() => {
    if (areas[editingAreaIndex]) {
      setBounds([
        areas[editingAreaIndex].bounds.x,
        areas[editingAreaIndex].bounds.y,
        areas[editingAreaIndex].bounds.width,
        areas[editingAreaIndex].bounds.height,
        true
      ]);
      const newAction = { label: "", data: "", displayText: "", text: "", mode: "datetime", initial: null, max: null, min: null, richMenuAliasId: "", ...areas[editingAreaIndex].action };
      ["initial", "max", "min"].forEach(key => {
        if (typeof newAction[key] === "string") newAction[key] = dayjs(newAction[key], newAction[key].replace(/\d{4}-\d{2}-\d{2}/, "YYYY-MM-DD").replace(/\d{2}:\d{2}/, "HH:mm"));
      });
      setAction(newAction);
    }
  }, [areas, editingAreaIndex]);
  return (
    <Dialog onClose={() => setIsDialogOpened(false)} open={isDialogOpened} scroll="body" maxWidth="xs">
      <DialogTitle>アクションを編集</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TapAreaController {...{
            menuImage,
            bounds
          }}
          readonly
          width={396} />
          <FormControl sx={{ width: "100%" }} required>
            <InputLabel>アクションの種類</InputLabel>
            <Select
              value={action.type}
              onChange={event => setActionProp("type", event.target.value)}
            >
              {Object.entries(actionTypes).map(([actionType, { label }]) =>
                (<MenuItem value={actionType} key={actionType}>{label}</MenuItem>)
              )}
            </Select>
          </FormControl>
          <TextField label="ラベル" value={action.label} onChange={e => setActionProp("label", e.target.value)} inputProps={{ maxLength: 40 }}/>
          {(action.type === "postback" || action.type === "datetimepicker" || action.type === "richmenuswitch") && (
            <TextField label="Webhookに送信するテキスト" value={action.data} onChange={e => setActionProp("data", e.target.value)} inputProps={{ maxLength: 300 }} required/>
          )}
          {action.type === "postback" && (
            <TextField label="メッセージとして表示するテキスト" value={action.displayText} onChange={e => setActionProp("displayText", e.target.value)} inputProps={{ maxLength: 300 }} />
          )}
          {action.type === "message" && (
            <TextField label="送信されるメッセージ" value={action.text} onChange={e => setActionProp("text", e.target.value)} inputProps={{ maxLength: 300 }} required />
          )}
          {action.type === "uri" && (
            <TextField
              label="URI"
              value={action.uri}
              onChange={e => setActionProp("uri", e.target.value)}
              inputProps={{ maxLength: 1000, pattern: "^(https?|line|tel):" }}
              required
              error={!/^(https?|line|tel):/.test(action.uri)}
              helperText="http(s)://, line://, tel: で始まるURI" />
          )}
          {action.type === "datetimepicker" && (
            <LocalizationProvider dateAdapter={AdapterDayjs} locale={jaLocale}>
              <FormControl sx={{ width: "100%" }} required>
                <InputLabel>ダイアログの種類</InputLabel>
                <Select
                  value={action.mode}
                  onChange={event => setActionProp("mode", event.target.value)}
                >
                  <MenuItem value="datetime">日時</MenuItem>
                  <MenuItem value="date">日付のみ</MenuItem>
                  <MenuItem value="time">時刻のみ</MenuItem>
                </Select>
              </FormControl>
              {
                (() => {
                  const createPickerProps = key => {
                    const isInitialValueFilled = (action.initial && action.initial !== "");
                    const isMinValueFilled = (action.min && action.min !== "");
                    const isMaxValueFilled = (action.max && action.max !== "");
                    const isRangeInvalid = (
                      key === "initial" && isInitialValueFilled && (
                        (isMinValueFilled && action.min > action.initial) ||
                        (isMaxValueFilled && action.max < action.initial)
                      ) ||
                      (isMaxValueFilled && isMinValueFilled && action.max < action.min)
                    );
                    return {
                      // eslint-disable-next-line react/display-name
                      renderInput: (params: TextFieldProps) => (
                        <TextField
                          {...params}
                          sx={{ flex: 1 }}
                          label={{ initial: "初期値", min: "最小値", max: "最大値" }[key]}
                          error={isRangeInvalid}
                          placeholder=""/>
                      ),
                      value: action[key] || null,
                      onChange: value => { setActionProp(key, value); },
                      required: false
                    };
                  };
                  switch (action.mode) {
                    case "datetime": {
                      const mask ="____/__/__ __:__";
                      return <>
                        <DateTimePicker {...createPickerProps("initial")} mask={mask}/>
                        <Stack direction="row" spacing={1}>
                          <DateTimePicker { ...createPickerProps("min")} mask={mask} />
                          <DateTimePicker {...createPickerProps("max")} mask={mask}/>
                        </Stack>
                      </>;
                    }
                    case "date": {
                      const mask = "____/__/__";
                      return <>
                        <DatePicker {...createPickerProps("initial")} mask={mask}/>
                        <Stack direction="row" spacing={1}>
                          <DatePicker {...createPickerProps("min")} mask={mask} />
                          <DatePicker {...createPickerProps("max")} mask={mask} />
                        </Stack>
                      </>;
                    }
                    case "time": {
                      const mask = "__:__";
                      return <>
                        <TimePicker {...createPickerProps("initial")} mask={mask}/>
                        <Stack direction="row" spacing={1}>
                          <TimePicker {...createPickerProps("min")} mask={mask}/>
                          <TimePicker {...createPickerProps("max")} mask={mask}/>
                        </Stack>
                      </>;
                    }
                  }
                })()
              }

            </LocalizationProvider>
          )}
          {action.type === "richmenuswitch" && (
            <TextField label="切替先リッチメニューのエイリアス" value={action.richMenuAliasId} onChange={e => setActionProp("richMenuAliasId", e.target.value)} required/>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpened(false)} variant="text">キャンセル</Button>
        <Button onClick={() => {
          const newAreas = [...areas];
          newAreas[editingAreaIndex].action = { ...newAreas[editingAreaIndex].action, ...action };
          const acceptableKeys = Array.from(new Set([...actionTypes[action.type].requires, ...actionTypes[action.type].acceptable, "type"]));
          Object.keys(newAreas[editingAreaIndex].action).forEach(key => {
            if (!acceptableKeys.includes(key) ||
              (actionTypes[action.type].acceptable.includes(key) && (!action[key] || action[key]?.trim?.().length === 0))
            ) {
              delete newAreas[editingAreaIndex].action[key];
            } else if (action.type === "datetimepicker" && ["initial", "min", "max"].includes(key)) {
              newAreas[editingAreaIndex].action[key] = newAreas[editingAreaIndex].action[key].format({ datetime: "YYYY-MM-DDTHH:mm", date: "YYYY-MM-DD", time: "HH:mm" }[action.mode]);
            }
          });
          setAreas(newAreas);
          setIsDialogOpened(false);
        }} disabled={
          action.type === "" ||
          actionTypes[action.type]?.requires?.some(key => !action[key] || action[key].trim?.() === "")
          || (
            action.type === "datetimepicker" && (
              !(action.min === "" || action.max === "") &&
            (
              action.max < action.min ||
              (action.initial && (
                action.initial < action.min ||
                action.max < action.initial
              ))
            )))
          || (action.type === "uri" && !/^(https?|line|tel):/.test(action.uri))
        }
        variant="text">保存</Button>
      </DialogActions>
    </Dialog>
  );
}
