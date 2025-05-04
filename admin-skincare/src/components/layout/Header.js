import React from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} />
            </div>
            <span>Admin</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;