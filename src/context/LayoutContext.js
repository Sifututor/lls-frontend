import React, { createContext, useState, useEffect } from 'react';

export const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile sidebar state (no localStorage needed for mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', collapsed);
    } catch {}
  }, [collapsed]);

  return (
    <LayoutContext.Provider 
      value={{ 
        collapsed, 
        setCollapsed,
        mobileOpen,
        setMobileOpen
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}