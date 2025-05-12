import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { brandService } from '../../services/brandService';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../../services/api';
import { convertToSeoAlias } from '../../utils/stringUtils';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Card,
  Space,
  Row,
  Col,
  Spin
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  DeleteOutlined, 
  CloseOutlined 
} from '@ant-design/icons';

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [form] = Form.useForm();
  const [banner, setBanner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize fetchBrand function
  const fetchBrand = useCallback(async () => {
    try {
      setLoading(true);
      const brand = await brandService.getBrand(id);
      form.setFieldsValue(brand);
      setBanner(brand.banner || '');
    } catch (err) {
      setError('Không thể tải thông tin thương hiệu');
      console.error('Error fetching brand:', err);
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    if (auth.user) {
      setAuthToken(auth.user.access_token);
      if (id) {
        fetchBrand();
      }
    }
  }, [auth.user, id, fetchBrand]);

  const handleBannerUpload = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
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
    onDrop: handleBannerUpload,
    multiple: false
  });

  const handleRemoveBanner = () => {
    setBanner('');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    form.setFieldsValue({
      title,
      alias: convertToSeoAlias(title)
    });
  };

  const onSubmit = async (values) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const brandData = {
        ...values,
        banner
      };
      
      if (id) {
        await brandService.updateBrand(id, brandData);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await brandService.createBrand(brandData);
        message.success('Thêm thương hiệu thành công');
      }
      
      navigate('/products/brands');
    } catch (err) {
      message.error(err.message || 'Không thể lưu thương hiệu. Vui lòng thử lại sau.');
      console.error('Error saving brand:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products/brands');
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </h1>
        <Button 
          icon={<CloseOutlined />}
          onClick={handleCancel}
        >
          Hủy
        </Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
              title: '',
              description: '',
              alias: ''
            }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item
                  label="Tên thương hiệu"
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu' }]}
                >
                  <Input 
                    placeholder="Nhập tên thương hiệu" 
                    onChange={handleTitleChange}
                  />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                >
                  <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item
                  label="Alias"
                  name="alias"
                  rules={[{ required: true, message: 'Vui lòng nhập alias' }]}
                >
                  <Input 
                    placeholder="Nhập alias" 
                    onChange={(e) => {
                      form.setFieldsValue({
                        alias: convertToSeoAlias(e.target.value)
                      });
                    }}
                  />
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
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {id ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default BrandForm; 