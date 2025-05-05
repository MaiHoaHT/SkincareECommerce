// src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Nếu đang chỉnh sửa, điền dữ liệu vào form
    if (user) {
      setFormData({
        userName: user.userName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.userName) newErrors.userName = 'Tên đăng nhập không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    if (!formData.firstName) newErrors.firstName = 'Tên không được để trống';
    if (!formData.lastName) newErrors.lastName = 'Họ không được để trống';
    if (!formData.dob) newErrors.dob = 'Ngày sinh không được để trống';
    
    // Kiểm tra password chỉ khi tạo mới hoặc cố tình thay đổi password
    if (!user && !formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Tạo đối tượng dữ liệu để gửi đi
      const userData = {
        userName: formData.userName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob,
      };
      
      // Thêm password nếu có
      if (formData.password) {
        userData.password = formData.password;
      }
      
      onSubmit(userData);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              disabled={user} // Không cho phép sửa username khi đã tạo
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>
          
          <div className="form-group">
            <label>Họ:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          
          <div className="form-group">
            <label>Tên:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
          
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>
          
          {(!user || formData.password) && (
            <>
              <div className="form-group">
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label>Xác nhận mật khẩu:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            </>
          )}
          
          <div className="form-buttons">
            <button type="submit">Lưu</button>
            <button type="button" onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;