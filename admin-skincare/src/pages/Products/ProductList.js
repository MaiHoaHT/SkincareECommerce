import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Star, Flame } from 'lucide-react';
import { productService } from '../../services/productService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import ProductModel from '../../models/ProductModel';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600">
          <Plus className="w-5 h-5 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
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
        ) : filteredProducts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nổi bật</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hot</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={`product-${product.id}`}>
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
                        onClick={() => {/* TODO: Implement edit function */}}
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
        )}
      </div>
    </div>
  );
};

export default ProductList;