import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import menuItems from '../../constants/menuItems';
import routes from '../../constants/routes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`sidebar bg-white h-full shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`logo-section p-4 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <img src= "/logoStore.png" alt="Logo" className="h-12" />
        {!isCollapsed && (
          <a href="/dashboard" className="text-lg font-bold ml-2">Admin</a>
        )}
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-700 text-gray-700 hover:text-white transition duration-200"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      </div>
      

      
      <div className="menu-section mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <NavLink 
                to={routes[item.id]} 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
                title={isCollapsed ? item.title : ''}
              >
                <span className={isCollapsed ? '' : 'mr-3'}>{<item.icon size={20} />}</span>
                {!isCollapsed && item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;