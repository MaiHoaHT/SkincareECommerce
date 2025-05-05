import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.removeUser();
            await auth.signoutRedirect();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo và tên */}
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12">
                            <img src="/logoStore.png" alt="Logo" className="h-12 w-12 object-contain" />
                        </div>
                        <h1 className="ml-3 text-2xl font-bold text-gray-900">Skincare Admin</h1>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="flex-1 max-w-lg mx-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
                            />
                        </div>
                    </div>

                    {/* Phần bên phải */}
                    <div className="flex items-center space-x-4">
                        {/* Notification */}
                        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                        </button>

                        {/* User info và Logout */}
                        {auth.isAuthenticated && (
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-base font-medium text-gray-900">
                                        {auth.user?.profile?.name || auth.user?.profile?.preferred_username || 'User'}
                                    </p>
                                    <p className="text-sm text-gray-500">Administrator</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;