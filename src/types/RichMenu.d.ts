import { Area as Bounds, Action as ActionBase, PostbackAction as PostbackActionBase, RichMenu as RichMenuBase, Size } from "@line/bot-sdk";

export type ActionType = "postback" | "message" | "uri" | "datetimepicker" | "richmenuswitch"
export type ActionPropKey = "label" | "data" | "displayText" | "text" | "inputOption" | "fillInText" | "uri" | "mode" | "initial" | "max" | "min" | "richMenuAliasId";

export type MenuImage = {
  fileName?: string,
  fileType?: "JPEG" | "PNG",
  fileSize?: number
  image?: HTMLImageElement,
}

export declare type PostbackAction = {
  type: "postback";
  data: string;
  text?: string;
  displayText?: string;
  inputOption?: "closeRichMenu" | "openRichMenu" | "openKeyboard" | "openVoice";
  fillInText?: string;
};
export type Action = (Exclude<ActionBase, PostbackActionBase> | ActionBase<PostbackAction> | { type: "" }) & {
  label?: string;
};

export type Area = {
  bounds: Bounds;
  action: Partial<Action>
};

export type RichMenu = Weaken<RichMenuBase, "areas"> & { areas?: Partial<Area>[] };

export type EditingRichMenuContextType = {
  richMenuId: string | "DELETED",
  richMenuAliases: string[],
  menuImage?: MenuImage,
  menu: RichMenu,
  setters: {
    setRichMenuId: React.Dispatch<React.SetStateAction<string | "DELETED">>,
    changeRichMenuId: React.Dispatch<React.SetStateAction<string | "DELETED">>,
    setRichMenuAliases: React.Dispatch<React.SetStateAction<string[]>>,
    setMenuImage: React.Dispatch<React.SetStateAction<MenuImage>>,
    setSize: React.Dispatch<React.SetStateAction<Size>>,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setChatBarText: React.Dispatch<React.SetStateAction<string>>,
    setAreas: React.Dispatch<React.SetStateAction<Area[]>>
  },
  isRichMenuIdReplaced: boolean,
  reset: (newId?: string) => string | void,
  loadFromDB: (richMenuId: string) => void
}

export type StoredRichMenu = Omit<EditingRichMenuContextType, "menuImage" | "setters" | "reset" | "loadFromDB" | "isRichMenuIdReplaced"> & {
  menuImage: Omit<MenuImage, "image"> & { imageSrc?: string }
};
