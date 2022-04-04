import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { apiList } from "constants/RichMenuAPI";
import { APIControllerContext } from "contexts/APIControllerContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext, useEffect } from "react";
import APIController from "../APIController";

export default function APIControlCard() {
  const menuContext = useContext(EditingRichMenuContext);
  const controllerContext = useContext(APIControllerContext);
  useEffect(() => {
    const newDataStore = { ...controllerContext.dataStore };
    apiList.forEach(({ key }) => {
      if (!newDataStore.key) newDataStore[key] = { results: [], params: {}};
    });
    controllerContext._setStoreValue(newDataStore);
  }, [apiList]);
  return (
    <Card>
      <CardContent>
        <APIController apiSpec={apiList.get("createRichMenu")} {...menuContext}>
          この機能の実行に引数は不要です。
          {menuContext.richMenuId.startsWith("richmenu-") && (
            <Alert severity="warning" sx={{ my: 1 }}>このリッチメニューはすでにアップロードされていますが、内容の<strong>上書きはできません</strong>。</Alert>
          )}
        </APIController>

        <APIController apiSpec={apiList.get("setRichMenuAsDefault")} {...menuContext} />

        <APIController apiSpec={apiList.get("linkRichMenuToUsers")} {...menuContext}>
          <TextField
            label="ユーザーID (改行区切りで複数指定可能)"
            multiline
            rows={3}
            value={controllerContext.dataStore.linkRichMenuToUsers?.params?.userIds as string || ""}
            onChange={e => controllerContext.setStoreValue("linkRichMenuToUsers", { ...controllerContext.dataStore.linkRichMenuToUsers, params: { ...controllerContext.dataStore.linkRichMenuToUsers.params, userIds: e.target.value }})}
            sx={{ width: "100%" }}
          />
        </APIController>

        <APIController apiSpec={apiList.get("addRichMenuAlias")} {...menuContext}>
          <TextField
            label="リッチメニューエイリアス"
            value={controllerContext.dataStore.addRichMenuAlias?.params?.alias as string || ""}
            onChange={e => controllerContext.setStoreValue("addRichMenuAlias", { ...controllerContext.dataStore.addRichMenuAlias, params: { ...controllerContext.dataStore.addRichMenuAlias.params, alias: e.target.value }})}
            sx={{ width: "100%" }}
          />
        </APIController>

        <APIController apiSpec={apiList.get("deleteRichMenuAlias")} {...menuContext}>
          <TextField
            label="リッチメニューエイリアス"
            value={controllerContext.dataStore.deleteRichMenuAlias?.params?.alias as string || ""}
            onChange={e => controllerContext.setStoreValue("deleteRichMenuAlias", { ...controllerContext.dataStore.deleteRichMenuAlias, params: { ...controllerContext.dataStore.deleteRichMenuAlias.params, alias: e.target.value }})}
            sx={{ width: "100%" }}
          />
        </APIController>

        <APIController apiSpec={apiList.get("deleteRichMenu")} {...menuContext}>
          {menuContext.richMenuId.startsWith("richmenu-") ? (
            <FormControlLabel
              control={<Checkbox
                checked={controllerContext.dataStore.deleteRichMenu?.params?.checked as boolean}
                onChange={e => controllerContext.setStoreValue("deleteRichMenu", { ...controllerContext.dataStore.deleteRichMenu, params: { ...controllerContext.dataStore.deleteRichMenu.params, checked: e.target.checked }})}
                disabled={!menuContext.richMenuId.startsWith("richmenu-")}
              />}
              label="エディタ上からも削除する" sx={{ mt: 1 }} />
          ) : (
            <Alert severity="warning" sx={{ mb: 1 }}>このリッチメニューはアップロードされていないため、APIは呼び出されずにエディタ上から削除されます。</Alert>
          )}
        </APIController>
      </CardContent>
    </Card>
  );
}
