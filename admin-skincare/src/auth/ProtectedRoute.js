// src/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    // Đăng nhập nếu chưa xác thực
    auth.signinRedirect();
    return <div>Redirecting to login...</div>;
  }

  return children;
};