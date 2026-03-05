import api from "../api";

export const threadService = {
    async getAll(params: any = {}) {
        const response = await api.get("/threads", { params });
        return response.data;
    },

    async getById(id: string | string[]) {
        const response = await api.get(`/threads/${id}`);
        return response.data;
    },

    async create(data: any) {
        const response = await api.post("/threads", data);
        return response.data;
    },

    async update(id: string | string[], data: any) {
        const response = await api.put(`/threads/${id}`, data);
        return response.data;
    },

    async delete(id: string | string[]) {
        const response = await api.delete(`/threads/${id}`);
        return response.data;
    },

    async getComments(id: string | string[], page: number = 1) {
        const response = await api.get(`/threads/${id}/comments`, { params: { page } });
        return response.data;
    }
};

export default threadService;
