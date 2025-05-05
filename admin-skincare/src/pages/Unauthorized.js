import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.removeUser();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Unauthorized Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        You don't have permission to access this resource.
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleLogout}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}; 