"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TitleContextValue {
  title: string | null;
  setTitle: (title: string | null) => void;
}

const TitleContext = createContext<TitleContextValue>({
  title: null,
  setTitle: () => {},
});

export function InfoscreenTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
}

export function useInfoscreenTitle() {
  return useContext(TitleContext);
}
