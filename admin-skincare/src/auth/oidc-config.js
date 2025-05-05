export const oidcConfig = {
    authority: "https://localhost:7261", // URL của Identity Server
    client_id: "react_admin",
    redirect_uri: "http://localhost:3000/signin-oidc",
    post_logout_redirect_uri: "http://localhost:3000/signout-callback-oidc",
    response_type: "code",
    scope: "openid profile api.skincare",
    loadUserInfo: true,
    silent_redirect_uri: "http://localhost:3000/silent-refresh.html",
    onSigninCallback: () => {
        // Xử lý callback sau khi đăng nhập thành công
        const path = window.location.pathname;
        if (path === '/signin-oidc') {
            window.history.replaceState(
                {},
                document.title,
                '/'
            );
        }
    },
    onSignoutCallback: () => {
        // Xử lý callback sau khi đăng xuất
        window.location.href = "/login";
    },
    monitorSession: false, // Tắt monitor session để tránh lỗi CSP
    checkSessionInterval: 0
}; 