import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { categoryService } from '../../services/categoryService';
import CategoryModel from '../../models/CategoryModel';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  message, 
  Card,
  Space,
  Row,
  Col
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  DeleteOutlined, 
  CloseOutlined 
} from '@ant-design/icons';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [form] = Form.useForm();
  const [banner, setBanner] = useState('');

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      fetchParentCategories();
      if (id) {
        fetchCategory();
      }
    }
  }, [auth.user, id]);

  const fetchParentCategories = async () => {
    try {
      const categories = await categoryService.getParentCategories();
      setParentCategories(categories);
    } catch (err) {
      console.error('Error fetching parent categories:', err);
    }
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await categoryService.getCategory(id);
      form.setFieldsValue(category);
      setBanner(category.banner || '');
    } catch (err) {
      setError('Không thể tải thông tin danh mục');
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (acceptedFiles) => {
    setUploadingBanner(true);
    try {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Không thể tải lên banner');
      console.error('Error uploading banner:', err);
    } finally {
      setUploadingBanner(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10485760, // 10MB
    onDrop: handleBannerUpload
  });

  const handleRemoveBanner = () => {
    setBanner('');
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const categoryData = new CategoryModel({
        ...values,
        banner
      });
      
      if (id) {
        await categoryService.updateCategory(id, categoryData);
        message.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.createCategory(categoryData);
        message.success('Thêm danh mục thành công');
      }
      
      setTimeout(() => {
        navigate('/products/categories');
      }, 500);
    } catch (err) {
      message.error(err.message || 'Không thể lưu danh mục. Vui lòng thử lại sau.');
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </h1>
        <Button 
          icon={<CloseOutlined />}
          onClick={() => navigate('/products/categories')}
        >
          Hủy
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            name: '',
            seoAlias: '',
            seoDescription: '',
            sortOrder: 0,
            parentId: null
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
              >
                <Input placeholder="Nhập tên danh mục" />
              </Form.Item>

              <Form.Item
                label="SEO Alias"
                name="seoAlias"
                rules={[{ required: true, message: 'Vui lòng nhập SEO Alias' }]}
              >
                <Input placeholder="Nhập SEO Alias" />
              </Form.Item>

              <Form.Item
                label="SEO Description"
                name="seoDescription"
                rules={[{ required: true, message: 'Vui lòng nhập SEO Description' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập SEO Description" />
              </Form.Item>

              <Form.Item
                label="Danh mục cha"
                name="parentId"
              >
                <Select
                  placeholder="Chọn danh mục cha"
                  allowClear
                  options={parentCategories.map(cat => ({
                    value: cat.id,
                    label: cat.name
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Thứ tự"
                name="sortOrder"
                rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
              >
                <InputNumber min={0} placeholder="Nhập thứ tự" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Banner"
              >
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input {...getInputProps()} />
                  {banner ? (
                    <div className="relative">
                      <img
                        src={banner}
                        alt="Banner"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveBanner}
                        className="absolute top-2 right-2"
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <UploadOutlined className="text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        Kéo thả hoặc click để tải lên banner
                      </p>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => {
                  if (loading) {
                    return;
                  }
                }}
              >
                {id ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => navigate('/products/categories')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryForm; 