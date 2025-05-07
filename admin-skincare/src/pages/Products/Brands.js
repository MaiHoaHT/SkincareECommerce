import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { brandService } from '../../services/brandService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import { message, Input, Table, Button, Space, Card, Spin, Modal } from 'antd';
import debounce from 'lodash/debounce';

// Component for lazy loaded image with loading state
const LazyImage = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-12 h-12">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spin size="small" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-12 h-12 object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-xs">No image</span>
        </div>
      )}
    </div>
  );
};

const Brands = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [brands, setBrands] = useState([]);
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
      fetchBrands(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchBrands();
    }
  }, [auth.user]);

  const fetchBrands = async (search = searchTerm) => {
    try {
      setLoading(true);
      const response = await brandService.getBrandsPaging(
        search,
        pagination.current,
        pagination.pageSize
      );
      setBrands(response.items);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount
      }));
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.');
      console.error('Error fetching brands:', err);
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
    fetchBrands();
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await brandService.deleteBrand(id);
          message.success('Xóa thương hiệu thành công');
          fetchBrands();
        } catch (err) {
          message.error(err.message || 'Không thể xóa thương hiệu. Vui lòng thử lại sau.');
          console.error('Error deleting brand:', err);
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/products/brands/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/products/brands/new');
  };

  const columns = [
    {
      title: 'Tên thương hiệu',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      render: (banner) => banner ? (
        <LazyImage src={banner} alt="Banner" />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-xs">No image</span>
        </div>
      ),
      width: 100,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      key: 'alias',
      sorter: true,
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
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý thương hiệu</h1>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAddNew}
        >
          Thêm thương hiệu
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            prefix={<Search className="text-gray-400 w-4 h-4" />}
            value={searchTerm}
            onChange={handleSearch}
            allowClear
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={brands.map(brand => ({
            ...brand,
            key: brand.id
          }))}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} thương hiệu`,
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

export default Brands; 