import { useState } from 'react';

export function useSidebar(initialState = true) {
  const [sidebarOpen, setSidebarOpen] = useState(initialState);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return { sidebarOpen, toggleSidebar };
}