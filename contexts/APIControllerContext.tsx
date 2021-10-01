import { APIResponse } from "constants/RichMenuAPI";
import React, { createContext, useContext, useState } from "react";

type DataStoreType = {
  results: APIResponse[],
  params: {[key: string]: unknown},
}

type APIControllerContextType = {
  dataStore: {
    [key: string]: DataStoreType
  },
  _setStoreValue: React.Dispatch<React.SetStateAction<{[key: string]: DataStoreType}>>
  setStoreValue: (key: string, value: DataStoreType) => void
  latestEditingRichMenuId: string,
  setLatestEditingRichMenuId: React.Dispatch<React.SetStateAction<string>>,
  isAPICalling: boolean,
  setIsAPICalling: React.Dispatch<React.SetStateAction<boolean>>
}

export const APIControllerContext = createContext<APIControllerContextType>({
  dataStore: {},
  _setStoreValue: () => {},
  setStoreValue: () => {},
  latestEditingRichMenuId: "",
  setLatestEditingRichMenuId: () => {},
  isAPICalling: false,
  setIsAPICalling: () => {}
});

export function APIControllerContextProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const context = useContext(APIControllerContext);
  const [dataStore, _setStoreValue] = useState(context.dataStore);
  const setStoreValue = (key: string, value: DataStoreType) => {
    _setStoreValue(dataStore => ({ ...dataStore, [key]: value }));
  };
  const [latestEditingRichMenuId, setLatestEditingRichMenuId] = useState(context.latestEditingRichMenuId);
  const [isAPICalling, setIsAPICalling] = useState(context.isAPICalling);
  const newContext = {
    dataStore, _setStoreValue, setStoreValue,
    latestEditingRichMenuId, setLatestEditingRichMenuId,
    isAPICalling, setIsAPICalling
  };
  return (
    <APIControllerContext.Provider value={newContext}>
      {children}
    </APIControllerContext.Provider>
  );
}
