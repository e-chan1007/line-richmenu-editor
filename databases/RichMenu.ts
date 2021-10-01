import Dexie from "dexie";
import { StoragedRichMenu } from "types/RichMenu";

class RichMenuDatabase extends Dexie {
  menus: Dexie.Table<StoragedRichMenu, string>;
  constructor() {
    super("RichMenuDatabase");
    this.version(1).stores({ menus: "++richMenuId" });
  }
}

export const richMenuDatabase = new RichMenuDatabase();
export default richMenuDatabase;
