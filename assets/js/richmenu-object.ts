class RichMenuObject {
  public size: RichMenuSize;
  public selected: Boolean;
  public name: String;
  public chatBarText: String;
  public areas: Array<RichMenuArea>;

  constructor() {
    this.size = new RichMenuSize();
    this.selected = false;
    this.name = "";
    this.chatBarText = "";
    this.areas = [];
  }
}

class RichMenuSize {
  public width: Number;
  public height: Number;

  constructor(width: Number = 0, height: Number = 0) {
    this.width = width;
    this.height = height;
  }
}

class RichMenuArea {
  public bounds: RichMenuAreaBounds;
  public action: RichMenuAction;

  constructor(
    bounds: RichMenuAreaBounds = new RichMenuAreaBounds(),
    action: RichMenuAction = new RichMenuAction()
  ) {
    this.bounds = bounds;
    this.action = action;
  }
}

class RichMenuAreaBounds {
  public x: Number;
  public y: Number;
  public width: Number;
  public height: Number;

  constructor(
    x: Number = 0,
    y: Number = 0,
    width: Number = 0,
    height: Number = 0
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

interface IRichMenuActionType {
  [index: string]: { id: String; name: String; icon: String };
}
const RichMenuActionType: IRichMenuActionType = {
  postback: {
    id: "postback",
    name: "ポストバック",
    icon: "fas fa-reply"
  },
  message: {
    id: "message",
    name: "メッセージ",
    icon: "fas fa-comment-alt"
  },
  uri: {
    id: "uri",
    name: "URI",
    icon: "fas fa-link"
  },
  datetimepicker: {
    id: "datetimepicker",
    name: "日時選択",
    icon: "fas fa-calendar-day"
  },
  richmenuswitch: {
    id: "richmenuswitch",
    name: "リッチメニュー切替",
    icon: "fas fa-exchange-alt"
  }
};

class RichMenuAction {
  public type: { id: String; name: String; icon: String };
  public label?: String;
  public data?: String;
  public displayText?: String;
  public text?: String;
  public uri?: String;
  public altUri: { desktop: String };
  public mode?: String = "date";
  public initial?: String;
  public max?: String;
  public min?: String;
  public richMenuAliasId?: String;

  constructor(type: string = "") {
    this.type = RichMenuActionType[type];
    this.altUri = { desktop: "" };
  }
}

export {
  RichMenuObject,
  RichMenuSize,
  RichMenuArea,
  RichMenuAreaBounds,
  RichMenuAction,
  RichMenuActionType
};
