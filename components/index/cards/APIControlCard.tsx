import Alert from "@material-ui/core/Alert";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { apiList } from "constants/RichMenuAPI";
import { APIControllerContext } from "contexts/APIControllerContext";
import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useContext } from "react";
import APIController from "../APIController";

export default function APIControlCard(): JSX.Element {
  const menuContext = useContext(EditingRichMenuContext);
  const controllerContext = useContext(APIControllerContext);

  return (
    <Card>
      <CardContent>
        <APIController apiSpec={apiList.get("createRichMenu")} {...menuContext}>
          この機能の実行に引数は不要です。
          {menuContext.richMenuId.startsWith("richmenu-") && (
            <Alert severity="warning" sx={{ my: 1 }}>このリッチメニューはすでにアップロードされていますが、内容の<strong>上書きはできません</strong>。</Alert>
          )}
        </APIController>
        <APIController apiSpec={apiList.get("deleteRichMenu")} {...menuContext}>
          <FormControlLabel
            control={<Switch
              checked={controllerContext.dataStore.deleteRichMenu?.params?.checked as boolean || !menuContext.richMenuId.startsWith("richmenu-")}
              onChange={e => controllerContext.setStoreValue("deleteRichMenu", { ... controllerContext.dataStore.deleteRichMenu, params: { ...controllerContext.dataStore.deleteRichMenu.params, checked: e.target.checked } })}
              disabled={!menuContext.richMenuId.startsWith("richmenu-")}
            />}
            label="エディタ上からも削除する" sx={{ mt: 1 }}/>
          {!menuContext.richMenuId.startsWith("richmenu-") && (
            <Alert severity="warning" sx={{ my: 1 }}>このリッチメニューはアップロードされていないため、APIは呼び出されずにエディタ上から削除されます。</Alert>
          )}
        </APIController>
      </CardContent>
    </Card>
  );
}
