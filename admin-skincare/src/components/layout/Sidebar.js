import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Package,
    Calendar,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import routes from '../../constants/routes';

const menuItems = [
    { path: routes.dashboard, icon: LayoutDashboard, label: 'Dashboard' },
    { path: routes.users, icon: Users, label: 'Users' },
    { path: routes.analytics, icon: BarChart3, label: 'Analytics' },
    { path: routes.products, icon: Package, label: 'Products' },
    { path: routes.calendar, icon: Calendar, label: 'Calendar' },
    { path: routes.messages, icon: MessageSquare, label: 'Messages' },
    { path: routes.settings, icon: Settings, label: 'Settings' }
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const auth = useAuth();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside className={`bg-white h-screen shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">Management</span>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    } ${isCollapsed ? 'justify-center' : ''}`
                                }
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium">{item.label}</span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;