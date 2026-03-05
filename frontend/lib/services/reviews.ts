import api from "../api";

export const reviewService = {
    async create(data: any) {
        const response = await api.post("/reviews", data);
        return response.data;
    },

    async update(id: string, data: any) {
        const response = await api.put(`/reviews/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default reviewService;
