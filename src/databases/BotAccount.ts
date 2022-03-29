import { BotAccount } from "contexts/BotAccountContext";
import Dexie from "dexie";

class BotAccountDatabase extends Dexie {
  accounts: Dexie.Table<BotAccount, string>;
  constructor() {
    super("BotAccountDatabase");
    this.version(1).stores({ accounts: "++basicId, *richMenus" });
  }
}

export const botAccountDatabase = new BotAccountDatabase();
export default botAccountDatabase;
