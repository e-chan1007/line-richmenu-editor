import React, { createContext, useContext, useState } from "react";

type PageLoadingStateContextType = {isPageLoading: boolean, setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>> };

export const PageLoadingStateContext = createContext<PageLoadingStateContextType>({ isPageLoading: true, setIsPageLoading: () => {} });

export function PageLoadingStateContextProvider({ children }: {children: React.ReactNode}) {
  const context = useContext(PageLoadingStateContext);
  const [isPageLoading, setIsPageLoading] = useState(context.isPageLoading);
  const newContext = { isPageLoading, setIsPageLoading };
  return (
    <PageLoadingStateContext.Provider value={newContext}>
      {children}
    </PageLoadingStateContext.Provider>
  );
}
