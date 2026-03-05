import api from "../api";

export const protocolService = {
    async getAll(params: any = {}) {
        const response = await api.get("/protocols", { params });
        return response.data;
    },

    async getById(id: string | string[]) {
        const response = await api.get(`/protocols/${id}`);
        return response.data;
    },

    async create(data: any) {
        const response = await api.post("/protocols", data);
        return response.data;
    },

    async update(id: string | string[], data: any) {
        const response = await api.put(`/protocols/${id}`, data);
        const patchResponse = await api.patch(`/protocols/${id}`, data); // Some APIs use PATCH
        return patchResponse.data || response.data;
    },

    async delete(id: string | string[]) {
        const response = await api.delete(`/protocols/${id}`);
        return response.data;
    },

    async restore(id: string | string[]) {
        const response = await api.post(`/protocols/${id}/restore`);
        return response.data;
    },

    async getThreads(id: string | string[], page: number = 1) {
        const response = await api.get(`/protocols/${id}/threads`, { params: { page } });
        return response.data;
    },

    async getReviews(id: string | string[], page: number = 1) {
        const response = await api.get(`/protocols/${id}/reviews`, { params: { page } });
        return response.data;
    }
};

export default protocolService;
