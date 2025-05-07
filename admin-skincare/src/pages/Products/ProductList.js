import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Star, Flame, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { productService } from '../../services/productService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import ProductModel from '../../models/ProductModel';
import routes from '../../constants/routes';
import { Input, Table, Button, Space, Card, Spin, Modal, App } from 'antd';
import debounce from 'lodash/debounce';

const ProductList = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    status: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const auth = useAuth();

  // Tạo debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchProducts(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchProducts();
    }
  }, [auth.user]);

  const fetchProducts = async (search = searchTerm) => {
    try {
      setLoading(true);
      const response = await productService.getProductsPaging(
        search,
        pagination.current,
        pagination.pageSize
      );
      setProducts(response.items);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount
      }));
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
      try {
        await Promise.all(selectedProducts.map(id => productService.deleteProduct(id)));
        setProducts(products.filter(p => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
      } catch (err) {
        setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
        console.error('Error deleting products:', err);
      }
    }
  };

  const handleBulkUpdateStatus = async (status) => {
    if (!selectedProducts.length) return;
    
    try {
      await Promise.all(selectedProducts.map(async (id) => {
        const product = await productService.getProductById(id);
        const updatedProduct = new ProductModel({
          ...product,
          isActive: status
        });
        await productService.updateProduct(id, updatedProduct);
      }));
      
      setProducts(products.map(p => 
        selectedProducts.includes(p.id) ? { ...p, isActive: status } : p
      ));
      setSelectedProducts([]);
    } catch (err) {
      setError('Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại sau.');
      console.error('Error updating product status:', err);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
      try {
        await productService.deleteProduct(productId);
          message.success('Xóa sản phẩm thành công');
          fetchProducts(); // Tải lại danh sách sau khi xóa
      } catch (err) {
          message.error(err.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
        console.error('Error deleting product:', err);
      }
    }
    });
  };

  const handleToggleFeature = async (productId, currentValue) => {
    try {
      const product = await productService.getProductById(productId);
      const updatedProduct = new ProductModel({
        ...product,
        isFeature: !currentValue
      });
      await productService.updateProduct(productId, updatedProduct);
      message.success('Cập nhật trạng thái nổi bật thành công');
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, isFeature: !currentValue }
            : p
        )
      );
    } catch (err) {
      message.error('Không thể cập nhật trạng thái nổi bật. Vui lòng thử lại sau.');
      console.error('Error updating feature status:', err);
    }
  };

  const handleToggleHot = async (productId, currentValue) => {
    try {
      const product = await productService.getProductById(productId);
      const updatedProduct = new ProductModel({
        ...product,
        isHot: !currentValue
      });
      await productService.updateProduct(productId, updatedProduct);
      message.success('Cập nhật trạng thái hot thành công');
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, isHot: !currentValue }
            : p
        )
      );
    } catch (err) {
      message.error('Không thể cập nhật trạng thái hot. Vui lòng thử lại sau.');
      console.error('Error updating hot status:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/products/new');
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Product"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 120,
      render: (price) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: (discount) => `${discount}%`,
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isFeature',
      key: 'isFeature',
      width: 80,
      render: (isFeature, record) => (
        <Button
          type="text"
          style={{
            backgroundColor: isFeature ? '#FEF3C7' : '#FFFFFF',
            borderRadius: '50%',
            padding: '4px',
            border: 'none'
          }}
          icon={
            <Star 
              style={{
                color: isFeature ? '#EAB308' : '#D1D5DB',
                width: '16px',
                height: '16px'
              }}
            />
          }
          onClick={() => handleToggleFeature(record.id, isFeature)}
        />
      ),
    },
    {
      title: 'Hot',
      dataIndex: 'isHot',
      key: 'isHot',
      width: 80,
      render: (isHot, record) => (
        <Button
          type="text"
          style={{
            backgroundColor: isHot ? '#FEE2E2' : '#FFFFFF',
            borderRadius: '50%',
            padding: '4px',
            border: 'none'
          }}
          icon={
            <Flame 
              style={{
                color: isHot ? '#EF4444' : '#D1D5DB',
                width: '16px',
                height: '16px'
              }}
            />
          }
          onClick={() => handleToggleHot(record.id, isHot)}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
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
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý sản phẩm</h1>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAddNew}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
                placeholder="Tìm kiếm sản phẩm..."
            prefix={<Search className="text-gray-400 w-4 h-4" />}
                value={searchTerm}
                onChange={handleSearch}
            allowClear
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} sản phẩm`,
          }}
          loading={loading}
          onChange={handleTableChange}
          locale={{
            emptyText: error || 'Không có dữ liệu'
          }}
        />
      </Card>
    </div>
  );
};

// Wrap the component with App provider
const ProductListWithApp = () => (
  <App>
    <ProductList />
  </App>
);

export default ProductListWithApp;