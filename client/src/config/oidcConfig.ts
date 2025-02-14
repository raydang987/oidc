import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const oidcConfig = {
    authority: "https://id2.tris.vn", // URL của OIDC Provider
    client_id: "oidcId", // ID của client
    redirect_uri: "http://localhost:5173/callback", // URL callback sau khi đăng nhập thành công
    response_type: "code",
    scope: "openid", // Các quyền truy cập
    post_logout_redirect_uri: "", // URL sau khi logout
    stateStore: new WebStorageStateStore({ store: window.localStorage }), // Lưu state vào localStorage
};

export const userManager = new UserManager(oidcConfig);
