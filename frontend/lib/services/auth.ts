import api from "../api";

export const authService = {
    async login(credentials: any) {
        const response = await api.post("/login", credentials);
        return response.data;
    },

    async register(userData: any) {
        const response = await api.post("/register", userData);
        return response.data;
    },

    async logout() {
        // Optional: Add backend logout if needed
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
    }
};

export default authService;
