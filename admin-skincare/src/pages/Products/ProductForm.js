import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDropzone } from 'react-dropzone';
import { productService } from '../../services/productService';
import ProductModel from '../../models/ProductModel';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Upload, 
  message, 
  Card, 
  Tabs,
  Space,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  DeleteOutlined, 
  CloseOutlined 
} from '@ant-design/icons';

// Schema validation
const schema = yup.object({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  description: yup.string().required('Mô tả là bắt buộc'),
  price: yup.number()
    .typeError('Giá phải là số')
    .required('Giá là bắt buộc')
    .min(0, 'Giá không được âm'),
  discount: yup.number()
    .typeError('Giảm giá phải là số')
    .min(0, 'Giảm giá không được âm')
    .max(100, 'Giảm giá không được vượt quá 100%'),
  quantity: yup.number()
    .typeError('Số lượng phải là số')
    .required('Số lượng là bắt buộc')
    .min(0, 'Số lượng không được âm'),
  categoryId: yup.string().required('Danh mục là bắt buộc'),
  brandId: yup.string().required('Thương hiệu là bắt buộc'),
  seoAlias: yup.string().required('SEO Alias là bắt buộc'),
  seoTitle: yup.string().required('SEO Title là bắt buộc'),
  seoDescription: yup.string().required('SEO Description là bắt buộc'),
}).required();

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form] = Form.useForm();

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      discount: '',
      quantity: '',
      categoryId: '',
      brandId: '',
      seoAlias: '',
      seoTitle: '',
      seoDescription: '',
      isFeature: false,
      isHot: false,
      isActive: true,
      images: []
    }
  });

  const handleImageUpload = async (acceptedFiles) => {
    setUploadingImages(true);
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
      
      setValue('images', [...watch('images'), ...uploadedImages]);
    } catch (err) {
      setError('Không thể tải lên hình ảnh');
      console.error('Error uploading images:', err);
    } finally {
      setUploadingImages(false);
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
    setValue('description', data);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    fetchCategories();
    fetchBrands();
  }, [id]);

  const fetchCategories = async () => {
    try {
      // TODO: Implement category fetching
      const mockCategories = [
        { value: '1', label: 'Skincare' },
        { value: '2', label: 'Makeup' },
        { value: '3', label: 'Haircare' }
      ];
      setCategories(mockCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      // TODO: Implement brand fetching
      const mockBrands = [
        { value: '1', label: 'La Roche-Posay' },
        { value: '2', label: 'CeraVe' },
        { value: '3', label: 'The Ordinary' }
      ];
      setBrands(mockBrands);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);
      form.setFieldsValue(product);
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (imageId) => {
    setValue('images', watch('images').filter(img => img.id !== imageId));
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const productData = new ProductModel(values);
      
      if (id) {
        await productService.updateProduct(id, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await productService.createProduct(productData);
        message.success('Thêm sản phẩm thành công');
      }
      
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      message.error(err.message || 'Không thể lưu sản phẩm. Vui lòng thử lại sau.');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !watch('name')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
              isActive: true
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
                data={watch('description')}
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

            {watch('images')?.length > 0 && (
              <Row gutter={[16, 16]} className="mt-4">
                {watch('images').map((image) => (
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

            <Form.Item
              label="SEO Title"
              name="seoTitle"
              rules={[{ required: true, message: 'Vui lòng nhập SEO Title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="SEO Description"
              name="seoDescription"
              rules={[{ required: true, message: 'Vui lòng nhập SEO Description' }]}
            >
              <Input.TextArea rows={4} />
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
          onClick={() => navigate('/products')}
        />
      </div>

      {error && message.error(error)}
      {success && message.success(success)}

      <Tabs items={items} />

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          {id ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;