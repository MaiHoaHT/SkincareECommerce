import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { AuthGuard } from './auth/AuthGuard';
import { AntdProvider } from './antd.config';
import { Login } from './pages/Login';
import { Unauthorized } from './pages/Unauthorized';
import { SigninCallback } from './pages/SigninCallback';
import { MainLayout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import Categories from './pages/Products/Categories';
import CategoryForm from './pages/Products/CategoryForm';
import Brands from './pages/Products/Brands';
import BrandForm from './pages/Products/BrandForm';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Users from './pages/System/Users';
import Roles from './pages/System/Roles';
import Functions from './pages/System/Functions';
import Permissions from './pages/System/Permissions';
import routes from './constants/routes';

function App() {
  return (
    <AntdProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/signin-oidc" element={<SigninCallback />} />
            <Route
              path="/*"
              element={
                <AuthGuard>
                  <MainLayout>
                    <Routes>
                      <Route path={routes.dashboard} element={<Dashboard />} />
                      <Route path={routes.products} element={<Products />} />
                      <Route path={routes.productList} element={<ProductList />} />
                      <Route path={routes.productForm} element={<ProductForm />} />
                      <Route path={routes.productEdit} element={<ProductForm />} />
                      <Route path={routes.categories} element={<Categories />} />
                      <Route path={routes.categoryForm} element={<CategoryForm />} />
                      <Route path={routes.categoryEdit} element={<CategoryForm />} />
                      <Route path={routes.brands} element={<Brands />} />
                      <Route path={routes.brandForm} element={<BrandForm />} />
                      <Route path={routes.brandEdit} element={<BrandForm />} />
                      <Route path={routes.orders} element={<Orders />} />
                      <Route path={routes.customers} element={<Customers />} />
                      <Route path={routes.users} element={<Users />} />
                      <Route path={routes.roles} element={<Roles />} />
                      <Route path={routes.functions} element={<Functions />} />
                      <Route path={routes.permissions} element={<Permissions />} />
                      <Route path="*" element={<Navigate to={routes.dashboard} replace />} />
                    </Routes>
                  </MainLayout>
                </AuthGuard>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </AntdProvider>
  );
}

export default App;