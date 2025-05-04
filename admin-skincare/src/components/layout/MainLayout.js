import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useSidebar } from '../../hooks/useSidebar'; // Đảm bảo đường dẫn đúng
import routes from '../../constants/routes';

// Hàm tiện ích để lấy tên trang từ đường dẫn
const getPageNameFromPath = (pathname) => {
  // Đảo ngược map routes để tìm key từ value
  for (const [key, value] of Object.entries(routes)) {
    if (value === pathname) {
      return key.charAt(0).toUpperCase() + key.slice(1); // Chuyển đổi chữ cái đầu thành hoa
    }
  }
  return 'Dashboard'; // Mặc định
};

export const MainLayout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  
  // Lấy tên trang từ đường dẫn hiện tại
  const pageName = getPageNameFromPath(location.pathname);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar với kiểu hiển thị giống code cũ */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-300 
                      w-64 h-full shadow-lg fixed md:relative z-30`}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageName={pageName} 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{pageName}</h1>
            <p className="text-gray-600">Welcome to your admin dashboard</p>
          </div>
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;