// src/auth/AuthProvider.jsx
import React from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { oidcConfig } from './oidc-config';

export const AuthProvider = ({ children }) => {
  return (
    <OidcAuthProvider {...oidcConfig}>
      {children}
    </OidcAuthProvider>
  );
};

// Hook để sử dụng trong các component
export const useAuth = () => {
  const auth = React.useContext(AuthContext);
  return auth;
};

const AuthContext = React.createContext(null);