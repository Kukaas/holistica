import api from "../api";

export const commentService = {
    async create(data: any) {
        const response = await api.post("/comments", data);
        return response.data;
    },

    async update(id: string, data: any) {
        const response = await api.put(`/comments/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    }
};

export default commentService;
