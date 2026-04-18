import api from "./api";

// Get all comments for a video
export const getVideoComments = async (videoId, params = {}) => {
    const response = await api.get(`/comments/${videoId}`, { params });
    return response.data.data;
};

// Add a comment to a video
export const addComment = async (videoId, content) => {
    const response = await api.post(`/comments/${videoId}`, { content });
    return response.data.data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
    const response = await api.patch(`/comments/c/${commentId}`, { content });
    return response.data.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/c/${commentId}`);
    return response.data;
};

// Toggle like on a comment
export const toggleCommentLike = async (commentId) => {
    const response = await api.post(`/likes/toggle/c/${commentId}`);
    return response.data;
};
