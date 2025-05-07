import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roleService } from '../../services/roleService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import { message, Input, Table, Button, Space, Card, Spin, Modal } from 'antd';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchRoles();
    }
  }, [auth.user]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách vai trò. Vui lòng thử lại sau.');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (roleId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa vai trò này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await roleService.deleteRole(roleId);
          message.success('Xóa vai trò thành công');
          fetchRoles();
        } catch (err) {
          message.error(err.message || 'Không thể xóa vai trò. Vui lòng thử lại sau.');
          console.error('Error deleting role:', err);
        }
      }
    });
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600">
          <Plus className="w-5 h-5 mr-2" />
          Thêm vai trò
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm vai trò..."
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
        ) : filteredRoles.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không tìm thấy vai trò nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{role.description || 'Không có mô tả'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={() => {/* TODO: Implement edit role */}}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(role.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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

export default Roles; 