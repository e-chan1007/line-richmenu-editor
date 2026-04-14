import React, { createContext, useContext, useEffect, useState } from "react";

import { EditingRichMenuContext } from "./EditingRichMenuContext";

type JSONEditorContextType = {
  jsonEditorValue: string,
  setJSONEditorValue: React.Dispatch<React.SetStateAction<string>>
};

export const JSONEditorContext = createContext<JSONEditorContextType>({ jsonEditorValue: "{}", setJSONEditorValue: () => {} });

export function JSONEditorContextProvider({ children }: {children: React.ReactNode}) {
  const { menu } = useContext(EditingRichMenuContext);
  const context = useContext(JSONEditorContext);
  const [jsonEditorValue, setJSONEditorValue] = useState(context.jsonEditorValue);
  const newContext = { jsonEditorValue, setJSONEditorValue };
  useEffect(() => {
    try {
      if (JSON.stringify(menu, null, 2) !== JSON.stringify(JSON.parse(jsonEditorValue), null, 2)) {
        setJSONEditorValue(JSON.stringify(menu, null, 2));
      }
    } catch (_) {
      setJSONEditorValue(JSON.stringify(menu, null, 2));
    }
  }, [JSON.stringify(menu)]);
  return (
    <JSONEditorContext.Provider value={newContext}>
      {children}
    </JSONEditorContext.Provider>
  );
}
