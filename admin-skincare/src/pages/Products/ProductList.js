import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Star, Flame, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { productService } from '../../services/productService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import ProductModel from '../../models/ProductModel';
import routes from '../../constants/routes';

const ProductList = () => {
  const navigate = useNavigate();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchProducts();
    }
  }, [auth.user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
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

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || product.categoryId === filters.category;
      const matchesBrand = !filters.brand || product.brandId === filters.brand;
      const matchesStatus = !filters.status || product.isActive === (filters.status === 'active');
      
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPrice = product.price >= min && (!max || product.price <= max);
      }
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesPrice;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDelete = async (productId) => {
    if (!productId) return;
    
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleToggleFeature = async (productId, currentValue) => {
    try {
      // Lấy thông tin sản phẩm hiện tại
      const currentProduct = await productService.getProductById(productId);
      
      // Tạo instance mới với dữ liệu hiện tại và thay đổi isFeature
      const updatedProduct = new ProductModel({
        id: currentProduct.id,
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        discount: currentProduct.discount,
        imageUrl: currentProduct.imageUrl,
        categoryId: currentProduct.categoryId,
        brandId: currentProduct.brandId,
        seoAlias: currentProduct.seoAlias,
        quantity: currentProduct.quantity,
        sold: currentProduct.sold,
        status: currentProduct.status,
        isFeature: !currentValue,
        isHome: currentProduct.isHome,
        isHot: currentProduct.isHot,
        isActive: currentProduct.isActive
      });

      // Cập nhật sản phẩm
      await productService.updateProduct(productId, updatedProduct);
      
      // Cập nhật state với giá trị mới
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, isFeature: !currentValue }
            : p
        )
      );
    } catch (err) {
      setError('Không thể cập nhật trạng thái nổi bật. Vui lòng thử lại sau.');
      console.error('Error updating feature status:', err);
    }
  };

  const handleToggleHot = async (productId, currentValue) => {
    try {
      // Lấy thông tin sản phẩm hiện tại
      const currentProduct = await productService.getProductById(productId);
      
      // Tạo instance mới với dữ liệu hiện tại và thay đổi isHot
      const updatedProduct = new ProductModel({
        id: currentProduct.id,
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        discount: currentProduct.discount,
        imageUrl: currentProduct.imageUrl,
        categoryId: currentProduct.categoryId,
        brandId: currentProduct.brandId,
        seoAlias: currentProduct.seoAlias,
        quantity: currentProduct.quantity,
        sold: currentProduct.sold,
        status: currentProduct.status,
        isFeature: currentProduct.isFeature,
        isHome: currentProduct.isHome,
        isHot: !currentValue,
        isActive: currentProduct.isActive
      });

      // Cập nhật sản phẩm
      await productService.updateProduct(productId, updatedProduct);
      
      // Cập nhật state với giá trị mới
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, isHot: !currentValue }
            : p
        )
      );
    } catch (err) {
      setError('Không thể cập nhật trạng thái hot. Vui lòng thử lại sau.');
      console.error('Error updating hot status:', err);
    }
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <button
          onClick={() => navigate(routes.productForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc
              {showFilters ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  {/* TODO: Add category options */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  {/* TODO: Add brand options */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Khoảng giá</label>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="0-100000">Dưới 100.000đ</option>
                  <option value="100000-500000">100.000đ - 500.000đ</option>
                  <option value="500000-1000000">500.000đ - 1.000.000đ</option>
                  <option value="1000000-">Trên 1.000.000đ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {selectedProducts.length > 0 && (
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Đã chọn {selectedProducts.length} sản phẩm
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkUpdateStatus(true)}
                className="px-3 py-1 text-sm text-green-600 hover:text-green-700"
              >
                Kích hoạt
              </button>
              <button
                onClick={() => handleBulkUpdateStatus(false)}
                className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-700"
              >
                Vô hiệu hóa
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === currentItems.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Tên sản phẩm
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      Giá
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hot</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={`product-${product.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.price.toLocaleString('vi-VN')}đ</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.discount}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleFeature(product.id, product.isFeature)}
                          className={`p-2 rounded-full ${
                            product.isFeature ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-100 text-gray-400'
                          } hover:bg-yellow-200 transition-colors`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleHot(product.id, product.isHot)}
                          className={`p-2 rounded-full ${
                            product.isHot ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'
                          } hover:bg-red-200 transition-colors`}
                        >
                          <Flame className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredProducts.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredProducts.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;