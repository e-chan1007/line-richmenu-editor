import Dexie from "dexie";

import type { BotAccount } from "contexts/BotAccountContext";

class BotAccountDatabase extends Dexie {
  accounts: Dexie.Table<BotAccount, string>;
  constructor() {
    super("BotAccountDatabase");
    this.version(1).stores({ accounts: "++basicId, *richMenus" });
  }
}

export const botAccountDatabase = new BotAccountDatabase();
export default botAccountDatabase;
