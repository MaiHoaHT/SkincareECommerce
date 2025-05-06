import React, { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import { permissionService } from '../../services/permissionService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchPermissions();
    }
  }, [auth.user]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await permissionService.getCommandViews();
      setPermissions(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách quyền hạn. Vui lòng thử lại sau.');
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!auth.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý quyền hạn</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm quyền hạn..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredPermissions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không tìm thấy quyền hạn nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên chức năng</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Xem</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thêm</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sửa</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Xóa</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duyệt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{permission.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{permission.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {permission.hasPermission('VIEW') ? (
                          <Shield className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {permission.hasPermission('CREATE') ? (
                          <Shield className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {permission.hasPermission('UPDATE') ? (
                          <Shield className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {permission.hasPermission('DELETE') ? (
                          <Shield className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {permission.hasPermission('APPROVE') ? (
                          <Shield className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Permissions; 