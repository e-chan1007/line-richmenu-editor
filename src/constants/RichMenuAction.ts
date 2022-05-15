import { ActionPropKey, ActionType, PostbackAction } from "types/RichMenu";

export const actionProp: {
  [key in ActionPropKey]: { label: string, description: string }
} = {
  label: {
    label: "ラベル",
    description: "アクセシビリティ機能が有効な場合に読み上げ"
  },
  data: {
    label: "Webhookに送信されるテキスト",
    description: "ポストバックイベントでWebhookに送信されるテキスト"
  },
  displayText: {
    label: "メッセージとして表示されるテキスト",
    description: "アクション実行時にユーザーのメッセージとして表示されるテキスト"

  },
  text: {
    label: "実行時に送信されるテキスト",
    description: "アクション実行時に送信されるテキスト"
  },
  inputOption: {
    label: "リッチメニューなどの表示方法",
    description: "アクションに応じた、リッチメニューなどの表示方法"
  },
  fillInText: {
    label: "あらかじめ入力しておく文字列",
    description: "キーボードを開いたときに、入力欄にあらかじめ入力しておく文字列"
  },
  uri: {
    label: "実行時に開かれるURI",
    description: "アクション実行時に開かれるURI(http/https/tel)"
  },
  mode: {
    label: "アクションモード",
    description: "ダイアログに表示される項目"
  },
  initial: {
    label: "日時の初期値",
    description: "ダイアログを開いたときに表示される日時"
  },
  max: {
    label: "日時の最大値",
    description: "ダイアログで選択可能な日時の最大値"
  },
  min: {
    label: "日時の最小値",
    description: "ダイアログで選択可能な日時の最小値"
  },
  richMenuAliasId: {
    label: "切り替え先エイリアス",
    description: "切り替え後に表示するリッチメニューのエイリアス"
  }
};

export const actionTypes: {
  [key in ActionType]: { label: string, description: string, requires: ActionPropKey[], acceptable: ActionPropKey[] }
} = {
  postback: {
    label: "ポストバック",
    description: "ポストバックイベントをWebhookに送信",
    requires: ["data"],
    acceptable: ["label", "displayText", "inputOption", "fillInText"]
  },
  message: {
    label: "メッセージ",
    description: "ユーザーのメッセージとして送信",
    requires: ["text"],
    acceptable: ["label"]
  },
  uri: {
    label: "URI",
    description: "LINE内ブラウザでURIを開く",
    requires: ["uri"],
    acceptable: ["label"]
  },
  datetimepicker: {
    label: "日時選択",
    description: "日時選択ダイアログを開く",
    requires: ["data", "mode"],
    acceptable: ["label", "initial", "max", "min"]
  },
  richmenuswitch: {
    label: "リッチメニュー切替",
    description: "リッチメニューを切り替える",
    requires: ["richMenuAliasId", "data"],
    acceptable: ["label"]
  }
};

export const postbackInputOptions: Record<PostbackAction["inputOption"], string> = {
  closeRichMenu: "リッチメニューを閉じる",
  openRichMenu: "リッチメニューを開く",
  openKeyboard: "キーボードを開く",
  openVoice: "ボイスメッセージ入力モードを開く"
};
