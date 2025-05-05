import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export const Login = () => {
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = async () => {
        try {
            await auth.signinRedirect({
                redirect_uri: window.location.origin + '/signin-oidc',
                state: { returnUrl: window.location.pathname }
            });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#ADDDCE]">
            {/* Left side - Banner */}
            <div className="hidden lg:flex lg:w-2/5 relative">
                <div className="w-full h-full p-8 bg-white">
                    <img 
                        src="/banner.png" 
                        alt="Banner" 
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#ADDDCE]/50">
                <div className="max-w-md w-full space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center">
                        <img src="/logoStore.png" alt="Logo" className="h-12 w-12" />
                    </div>

                    <div className="text-center">
                        <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
                            Sign in to your account
                        </h2>
                        <p className="mt-3 text-base text-gray-700 font-medium">
                            Access your admin dashboard
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <button
                            onClick={handleLogin}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-md text-[#8BC6B0] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC6B0] transition-all duration-200 shadow-sm"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LogIn className="h-6 w-6 text-[#8BC6B0] group-hover:text-[#6BA99A]" />
                            </span>
                            Sign in with Identity Server
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-medium">
                                By signing in, you agree to our{' '}
                                <a href="#" className="font-semibold text-[#8BC6B0] hover:text-[#6BA99A]">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="font-semibold text-[#6BA99A] hover:text-[#4D8C7D]">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 