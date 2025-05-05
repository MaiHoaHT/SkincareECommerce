import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SigninCallback = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                if (!auth.isLoading) {
                    if (auth.isAuthenticated) {
                        // Lấy returnUrl từ state hoặc mặc định là '/'
                        const returnUrl = location.state?.returnUrl || '/';
                        navigate(returnUrl, { replace: true });
                    } else {
                        navigate('/login', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error handling callback:', error);
                navigate('/login', { replace: true });
            }
        };

        handleCallback();
    }, [auth.isLoading, auth.isAuthenticated, navigate, location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Processing login...</h2>
                <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}; 