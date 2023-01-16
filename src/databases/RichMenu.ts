import Dexie from "dexie";

import type { StoredRichMenu } from "types/RichMenu";

class RichMenuDatabase extends Dexie {
  menus: Dexie.Table<StoredRichMenu, string>;
  constructor() {
    super("RichMenuDatabase");
    this.version(1).stores({ menus: "++richMenuId" });
  }
}

export const richMenuDatabase = new RichMenuDatabase();
export default richMenuDatabase;
