import api from "../api";

export const voteService = {
    async cast(votableId: string, votableType: string, value: number) {
        const response = await api.post("/votes", {
            votable_id: votableId,
            votable_type: votableType,
            value: value
        });
        return response.data;
    }
};

export default voteService;
