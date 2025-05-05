import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Nếu đã đăng nhập, chuyển hướng về trang chủ
    if (auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = async () => {
        try {
            // Lưu URL hiện tại để redirect sau khi đăng nhập
            const returnUrl = location.state?.from?.pathname || '/';
            await auth.signinRedirect({
                redirect_uri: window.location.origin + '/signin-oidc',
                state: { returnUrl }
            });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div>
                    <button
                        onClick={handleLogin}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}; 