import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Products from './pages/Products';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import routes from './constants/routes';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.users} element={<Users />} />
          <Route path={routes.analytics} element={<Analytics />} />
          <Route path={routes.products} element={<Products />} />
          <Route path={routes.calendar} element={<Calendar />} />
          <Route path={routes.messages} element={<Messages />} />
          <Route path={routes.settings} element={<Settings />} />
          <Route path="*" element={<Navigate to={routes.dashboard} replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;