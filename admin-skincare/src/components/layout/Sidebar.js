import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import menuItems from '../../constants/menuItems';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const auth = useAuth();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);

    // Auto-expand parent menu when child route is active
    useEffect(() => {
        const currentPath = location.pathname;
        menuItems.forEach(item => {
            if (item.children) {
                const hasActiveChild = item.children.some(child => child.path === currentPath);
                if (hasActiveChild) {
                    setExpandedItems(prev => ({
                        ...prev,
                        [item.id]: true
                    }));
                }
            }
        });
    }, [location.pathname]);

    const toggleSubmenu = (itemId, e) => {
        e.preventDefault();
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const renderMenuItem = (item) => {
        const isExpanded = expandedItems[item.id];
        const isHovered = hoveredItem === item.id;
        const Icon = item.icon;

        return (
            <div key={item.id} className="mb-2">
                {item.children ? (
                    // Parent menu item with children
                    <div>
                        <button
                            onClick={(e) => toggleSubmenu(item.id, e)}
                            className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'px-3'} py-2 text-gray-700 rounded-lg ${
                                isHovered ? 'bg-gray-100' : ''
                            }`}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Icon className="w-5 h-5" />
                            {sidebarOpen && (
                                <>
                                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                        
                        {sidebarOpen && isExpanded && (
                            <div className="ml-8 mt-2 space-y-1">
                                {item.children.map(child => (
                                    <NavLink
                                        key={child.id}
                                        to={child.path}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 text-gray-600 rounded-lg ${
                                                isActive ? 'bg-blue-50 text-blue-600' : ''
                                            } ${hoveredItem === child.id ? 'bg-gray-100' : ''}`
                                        }
                                        onMouseEnter={() => setHoveredItem(child.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <child.icon className="w-4 h-4" />
                                        <span className="ml-3">{child.title}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Regular menu item without children
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center ${sidebarOpen ? 'px-4' : 'px-3'} py-2 text-gray-700 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : ''
                            } ${isHovered ? 'bg-gray-100' : ''}`
                        }
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Icon className="w-5 h-5" />
                        {sidebarOpen && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`bg-white border-r border-gray-200 transition-all duration-300 ${
                sidebarOpen ? 'w-64' : 'w-14'
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo và nút toggle */}
                <div className={`flex items-center justify-between ${sidebarOpen ? 'p-4' : 'p-2'} border-b`}>
                    {sidebarOpen && (
                        <div className="flex items-center">
                            <img src="/logoStore.png" alt="Logo" className="h-8 w-8" />
                            <span className="ml-2 text-lg font-semibold">Flora Store</span>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-lg hover:bg-gray-100"
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="w-6 h-6" />
                        ) : (
                            <ChevronRight className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Menu items */}
                <nav className={`flex-1 ${sidebarOpen ? 'p-4' : 'p-2'} overflow-y-auto`}>
                    {menuItems.map(renderMenuItem)}
                </nav>

                {/* User info */}
                <div className={`p-4 border-t ${!sidebarOpen && 'hidden'}`}>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{auth.user?.profile?.name}</p>
                            <p className="text-xs text-gray-500">{auth.user?.profile?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;