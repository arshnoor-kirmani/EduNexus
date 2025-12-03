"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const LoaderContext = createContext<{
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
}>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = () => useContext(LoaderContext);
