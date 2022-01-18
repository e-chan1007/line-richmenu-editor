import botAccountDatabase from "databases/BotAccount";
import richMenuDatabase from "databases/RichMenu";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import rfdc from "rfdc/default";
import { EditingRichMenuContextType, StoragedRichMenu } from "types/RichMenu";
import { v4 as uuidv4 } from "uuid";
import { BotAccountContext } from "./BotAccountContext";
import { PageLoadingStateContext } from "./PageLoadingStateContext";

export const EditingRichMenuContext = createContext<EditingRichMenuContextType>({
  richMenuId: null,
  richMenuAliases: [],
  menu: {
    size: { width: 0, height: 0 },
    selected: false,
    name: "",
    chatBarText: "",
    areas: []
  },
  isRichMenuIdReplaced: true,
  setters: {
    setRichMenuId: () => { },
    changeRichMenuId: () => { },
    setRichMenuAliases: () => { },
    setMenuImage: () => { },
    setSize: () => { },
    setSelected: () => { },
    setName: () => { },
    setChatBarText: () => { },
    setAreas: () => { }
  },
  reset: () => { },
  loadFromDB: () => { }
});

export function EditingRichMenuContextProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(EditingRichMenuContext);
  const { setIsPageLoading } = useContext(PageLoadingStateContext);
  const { setAccounts, setEditingBotId } = useContext(BotAccountContext);

  const [richMenuId, setRichMenuId] = useState(context.richMenuId);
  const [richMenuAliases, setRichMenuAliases] = useState(context.richMenuAliases);
  const [menuImage, setMenuImage] = useState(context.menuImage);
  const [size, setSize] = useState(context.menu.size);
  const [selected, setSelected] = useState(context.menu.selected);
  const [name, setName] = useState(context.menu.name);
  const [chatBarText, setChatBarText] = useState(context.menu.chatBarText);
  const [areas, setAreas] = useState(context.menu.areas);

  const [oldRichMenuId, setOldRichMenuId] = useState("");
  const [isRichMenuIdReplaced, setIsRichMenuIdReplaced] = useState(context.isRichMenuIdReplaced);

  const newContext: EditingRichMenuContextType = useMemo(() => ({
    richMenuId,
    richMenuAliases,
    menuImage,
    isRichMenuIdReplaced,
    menu: {
      size,
      selected,
      name,
      chatBarText,
      areas
    },
    setters: {
      setRichMenuId,
      setRichMenuAliases,
      setMenuImage,
      setSize,
      setSelected,
      setName,
      setChatBarText,
      setAreas,
      changeRichMenuId: newId => {
        setIsRichMenuIdReplaced(true);
        setRichMenuId(newId);
      }
    },
    reset: _newId => {
      const newId = typeof _newId === "undefined" ? uuidv4() : _newId;
      setIsRichMenuIdReplaced(false);
      setRichMenuId(newId);
      setRichMenuAliases([]);
      setMenuImage(null);
      setSize({ width: 0, height: 0 });
      setSelected(false);
      setName("");
      setChatBarText("");
      setAreas([]);
      return newId;
    },
    loadFromDB: richMenuId => {
      setIsPageLoading(true);
      richMenuDatabase.menus.where("richMenuId").equalsIgnoreCase(richMenuId).first().then(async value => {
        if (value) {
          newContext.setters.setRichMenuId(value.richMenuId);
          newContext.setters.setRichMenuAliases(value.richMenuAliases);
          if (value.menuImage?.imageSrc) {
            const image = new Image();
            image.src = value.menuImage.imageSrc;
            await new Promise<void>(resolve => { image.onload = () => resolve(); });
            newContext.setters.setMenuImage({
              fileName: value.menuImage.fileName,
              fileType: value.menuImage.fileType,
              fileSize: value.menuImage.fileSize,
              image
            });
          } else {
            newContext.setters.setMenuImage(null);
          }
          Object.entries(value.menu).forEach(([key, value]) => {
            newContext.setters[`set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`](value);
          });
        }
        setIsPageLoading(false);
      });
    }
  }), [areas, chatBarText, isRichMenuIdReplaced, menuImage, name, richMenuAliases, richMenuId, selected, size]);

  useEffect(() => {
    (async () => {
      setIsPageLoading(true);
      const editingMenuId = window.localStorage.getItem("editingMenuId");
      if (editingMenuId) {
        newContext.loadFromDB(editingMenuId);
        setEditingBotId((await botAccountDatabase.accounts.where("richMenus").equalsIgnoreCase(editingMenuId).first()).basicId);
      } else {
        setIsPageLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!newContext.richMenuId) return;
      const savedRichMenu = rfdc(newContext) as EditingRichMenuContextType & StoragedRichMenu;
      delete savedRichMenu.setters;
      delete savedRichMenu.reset;
      delete savedRichMenu.loadFromDB;
      if (newContext.menuImage?.image) {
        savedRichMenu.menuImage = { ...savedRichMenu.menuImage, imageSrc: newContext.menuImage.image.src };
        delete savedRichMenu.menuImage.image;
      }
      if (newContext.richMenuId !== "DELETED") {
        richMenuDatabase.menus.put(savedRichMenu);
        if (isRichMenuIdReplaced && oldRichMenuId !== newContext.richMenuId) {
          richMenuDatabase.menus.delete(oldRichMenuId);
          const oldBotAccount = (await botAccountDatabase.accounts.where("richMenus").equalsIgnoreCase(oldRichMenuId).first());
          if (oldBotAccount) {
            oldBotAccount.richMenus.splice(oldBotAccount.richMenus.findIndex(
              richMenuId => richMenuId === oldRichMenuId),
            1,
            newContext.richMenuId);
            await botAccountDatabase.accounts.update(oldBotAccount.basicId, {
              richMenuId: newContext.richMenuId,
              richMenus: oldBotAccount.richMenus
            });
            setAccounts(await botAccountDatabase.accounts.toArray());
          }
          setIsRichMenuIdReplaced(false);
        }
      } else {
        richMenuDatabase.menus.delete(oldRichMenuId);
        newContext.reset(null);
      }
      setOldRichMenuId(newContext.richMenuId);
      window.localStorage.setItem("editingMenuId", newContext.richMenuId);
    })();
  }, [newContext]);

  return (
    <EditingRichMenuContext.Provider value={newContext}>
      {children}
    </EditingRichMenuContext.Provider>
  );
}
