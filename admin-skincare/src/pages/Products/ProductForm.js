import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDropzone } from 'react-dropzone';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import ProductModel from '../../models/ProductModel';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  message, 
  Card, 
  Tabs,
  Space,
  Row,
  Col,
  Divider,
  App
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  DeleteOutlined, 
  CloseOutlined 
} from '@ant-design/icons';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [form] = Form.useForm();

  const handleImageUpload = async (acceptedFiles) => {
    try {
      const uploadedImages = await Promise.all(acceptedFiles.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      }));
      
      setImages(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      messageApi.error('Không thể tải lên hình ảnh');
      console.error('Error uploading images:', err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10485760, // 10MB
    onDrop: handleImageUpload
  });

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    form.setFieldValue('description', data);
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoryOptions = response.map(category => ({
        value: category.id,
        label: category.name
      }));
      setCategories(categoryOptions);
    } catch (err) {
      console.error('Error fetching categories:', err);
      messageApi.error('Không thể tải danh sách danh mục');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandService.getBrands();
      const brandOptions = response.map(brand => ({
        value: brand.id,
        label: brand.title
      }));
      setBrands(brandOptions);
    } catch (err) {
      console.error('Error fetching brands:', err);
      messageApi.error('Không thể tải danh sách thương hiệu');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    fetchCategories();
    fetchBrands();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);
      form.setFieldsValue({
        ...product,
        description: product.description
      });
      if (product.imageUrl) {
        setImages([{ id: '1', url: product.imageUrl }]);
      }
    } catch (err) {
      messageApi.error('Không thể tải thông tin sản phẩm');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Create ProductModel instance
      const productModel = new ProductModel({
        id: id || undefined,
        name: values.name,
        description: values.description,
        price: Number(values.price),
        discount: Number(values.discount || 0),
        quantity: Number(values.quantity),
        categoryId: values.categoryId,
        brandId: values.brandId,
        seoAlias: values.seoAlias,
        imageUrl: images[0]?.url || '',
        isFeature: values.isFeature || false,
        isHot: values.isHot || false,
        isActive: values.isActive || true,
        status: values.isActive || true,
        isHome: values.isHome || false,
        sold: values.sold || 0,
        createDate: id ? undefined : new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      });

      // Log data before sending
      console.log('Form Values:', values);
      console.log('Product Model:', JSON.stringify(productModel, null, 2));
      console.log('Images:', images);

      if (id) {
        await productService.updateProduct(id, productModel);
        messageApi.success('Cập nhật sản phẩm thành công');
      } else {
        await productService.createProduct(productModel);
        messageApi.success('Thêm sản phẩm thành công');
      }
      
      navigate('/products/list');
    } catch (err) {
      console.error('Error saving product:', err);
      if (err.response?.data?.errors) {
        messageApi.error(err.response.data.errors.join(', '));
      } else {
        messageApi.error(err.message || 'Không thể lưu sản phẩm. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
              isFeature: false,
              isHot: false,
              isActive: true,
              discount: 0,
              quantity: 0
            }}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <CKEditor
                editor={ClassicEditor}
                data={form.getFieldValue('description')}
                onChange={handleEditorChange}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'blockQuote',
                    'insertTable',
                    'undo',
                    'redo'
                  ]
                }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    addonAfter="đ"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Giảm giá"
                  name="discount"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Danh mục"
                  name="categoryId"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select
                    options={categories}
                    placeholder="Chọn danh mục"
                    loading={loading}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thương hiệu"
                  name="brandId"
                  rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                >
                  <Select
                    options={brands}
                    placeholder="Chọn thương hiệu"
                    loading={loading}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Trạng thái">
              <Space>
                <Form.Item name="isFeature" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Nổi bật" unCheckedChildren="Không nổi bật" />
                </Form.Item>
                <Form.Item name="isHot" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Hot" unCheckedChildren="Không hot" />
                </Form.Item>
                <Form.Item name="isActive" valuePropName="checked" noStyle>
                  <Switch checkedChildren="Đang bán" unCheckedChildren="Ngừng bán" />
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: '2',
      label: 'Hình ảnh & SEO',
      children: (
        <Card>
          <Form form={form} layout="vertical">
            <Form.Item label="Hình ảnh sản phẩm">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
              >
                <input {...getInputProps()} />
                <UploadOutlined className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600">
                  Kéo thả hoặc click để chọn file
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </Form.Item>

            {images.length > 0 && (
              <Row gutter={[16, 16]} className="mt-4">
                {images.map((image) => (
                  <Col span={4} key={image.id}>
                    <div className="relative group aspect-square">
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(image.id)}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            <Divider />

            <Form.Item
              label="SEO Alias"
              name="seoAlias"
              rules={[{ required: true, message: 'Vui lòng nhập SEO Alias' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
        <Button
          icon={<CloseOutlined />}
          onClick={() => navigate('/products/list')}
        />
      </div>

      {error && messageApi.error(error)}

      <Tabs items={items} />

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={() => {
            form.validateFields()
              .then(values => {
                onSubmit(values);
              })
              .catch(error => {
                console.error('Validation failed:', error);
              });
          }}
        >
          {id ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </div>
  );
};

// Wrap the component with App provider
const ProductFormWithApp = () => (
  <App>
    <ProductForm />
  </App>
);

export default ProductFormWithApp;