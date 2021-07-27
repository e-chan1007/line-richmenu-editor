import botAccountDatabase from "databases/BotAccount";
import React, { createContext, useContext, useEffect, useState } from "react";

export type BotAccount = {
  basicId: string,
  botName: string,
  channelAccessToken: string,
  richMenus: string[],
  pictureUrl?: string
}

export const BotAccountContext = createContext<{
  accounts: BotAccount[],
  setAccounts: React.Dispatch<React.SetStateAction<BotAccount[]>>,
  editingBotId: string,
  setEditingBotId: React.Dispatch<React.SetStateAction<string>>
}>({
  accounts: [],
  setAccounts: () => {},
  editingBotId: "",
  setEditingBotId: () => {}
});

export function BotAccountContextProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const context = useContext(BotAccountContext);
  const [accounts, setAccounts] = useState(context.accounts);
  const [editingBotId, setEditingBotId] = useState(context.editingBotId);
  const newContext = { accounts, setAccounts, editingBotId, setEditingBotId };

  useEffect(() => {
    (async () => {
      setAccounts(await botAccountDatabase.accounts.toArray());
    })();
  }, []);

  useEffect(() => {
    accounts.forEach(account => {
      botAccountDatabase.accounts.put(account);
    });
  }, [accounts]);

  return (
    <BotAccountContext.Provider value={newContext}>
      {children}
    </BotAccountContext.Provider>
  );
}
