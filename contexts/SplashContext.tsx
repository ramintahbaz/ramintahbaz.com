'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SplashContextValue = {
  splashDone: boolean;
  setSplashDone: (value: boolean) => void;
};

const SplashContext = createContext<SplashContextValue | null>(null);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  return (
    <SplashContext.Provider value={{ splashDone, setSplashDone }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash(): SplashContextValue {
  const ctx = useContext(SplashContext);
  if (!ctx) throw new Error('useSplash must be used within SplashProvider');
  return ctx;
}
