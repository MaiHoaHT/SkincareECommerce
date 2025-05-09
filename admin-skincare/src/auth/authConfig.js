// src/auth/authConfig.js
export const oidcConfig = {
    authority: 'https://localhost:7261', // URL của IdentityServer
    client_id: 'react_admin',
    redirect_uri: 'http://localhost:3000/callback',
    response_type: 'code',
    scope: 'openid profile api.skincare',
    silent_redirect_uri: 'http://localhost:3000/silent-refresh.html',
    // Các cài đặt bổ sung
    automaticSilentRenew: true,
    loadUserInfo: true,
    
    // Các URL liên quan đến đăng xuất
    post_logout_redirect_uri: 'http://localhost:3000',
  };