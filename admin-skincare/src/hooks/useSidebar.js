import { useState } from 'react';

export function useSidebar(initialState = true) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return { isSidebarOpen, toggleSidebar };
}