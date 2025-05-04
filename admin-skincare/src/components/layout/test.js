import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { getPageTitle } from '../../utils/helpers';
import {DashboardContent} from '../dashboard';
import { UserContent } from '../users';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{getPageTitle(activeMenu)}</h1>
            <p className="text-gray-600">Welcome to your admin dashboard</p>
          </div>
          {activeMenu === 'dashboard' && <DashboardContent />}
          {activeMenu === 'users' && <UserContent />}
          {activeMenu === 'products' && <div className="text-gray-500">Products management content goes here</div>}
          {activeMenu === 'settings' && <div className="text-gray-500">Settings content goes here</div>}
        </main>

        <Footer />
      </div>
    </div>
  );
}
