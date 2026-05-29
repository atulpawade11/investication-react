import React, { createContext, useContext } from "react";

interface BootContextType {
  breadcrumbImage?: string;
}

const BootContext = createContext<BootContextType>({});

export const useBoot = () => useContext(BootContext);

export function BootProvider({
  children,
  breadcrumbImage,
}: {
  children: React.ReactNode;
  breadcrumbImage?: string;
}) {
  return (
    <BootContext.Provider value={{ breadcrumbImage }}>
      {children}
    </BootContext.Provider>
  );
}