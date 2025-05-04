import React from 'react';

function SidebarItem({ icon, title, isActive, onClick, collapsed }) {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-lg ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'} transition-colors`}
      >
        <span className="min-w-[24px]">{icon}</span>
        {!collapsed && <span className="ml-3">{title}</span>}
      </button>
    </li>
  );
}

export default SidebarItem;