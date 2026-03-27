import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-container animate-fade-in">
            <Outlet />
          </main>
        </div>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="mobile-overlay" 
            onClick={closeSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
              display: 'block'
            }}
          />
        )}
      </div>
    </LayoutContext.Provider>
  );
}
