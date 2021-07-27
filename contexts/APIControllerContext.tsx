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
}

export const APIControllerContext = createContext<APIControllerContextType>({
  dataStore: {},
  _setStoreValue: () => {},
  setStoreValue: () => {}
});

export function APIControllerContextProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const context = useContext(APIControllerContext);
  const [dataStore, _setStoreValue] = useState(context.dataStore);
  const setStoreValue = (key: string, value: DataStoreType) => {
    _setStoreValue({ ...dataStore, [key]: value });
  };
  const newContext = { dataStore, _setStoreValue, setStoreValue };
  return (
    <APIControllerContext.Provider value={newContext}>
      {children}
    </APIControllerContext.Provider>
  );
}
