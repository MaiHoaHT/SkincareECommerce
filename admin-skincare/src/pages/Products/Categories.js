import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import { message, Input, Table, Button, Space, Card, Spin, Modal } from 'antd';
import debounce from 'lodash/debounce';

const Categories = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Tạo debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchCategories(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchCategories();
    }
  }, [auth.user]);

  const fetchCategories = async (search = searchTerm) => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoriesPaging(
        search,
        pagination.current,
        pagination.pageSize
      );
      setCategories(response.items);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount
      }));
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa danh mục này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await categoryService.deleteCategory(id);
          message.success('Xóa danh mục thành công');
          fetchCategories();
        } catch (err) {
          message.error(err.message || 'Không thể xóa danh mục. Vui lòng thử lại sau.');
          console.error('Error deleting category:', err);
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/products/categories/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/products/categories/new');
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'SEO Alias',
      dataIndex: 'seoAlias',
      key: 'seoAlias',
      sorter: true,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      sorter: true,
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(record.id)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (!auth.user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý danh mục</h1>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAddNew}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm danh mục..."
            prefix={<Search className="text-gray-400 w-4 h-4" />}
            value={searchTerm}
            onChange={handleSearch}
            allowClear
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} danh mục`,
          }}
          loading={loading}
          onChange={handleTableChange}
          locale={{
            emptyText: error || 'Không có dữ liệu'
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default Categories; 