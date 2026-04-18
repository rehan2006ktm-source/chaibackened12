import api from "./api";

// Fetch all videos (with optional query params: page, limit, query, sortBy, sortType, userId)
export const getAllVideos = async (params = {}) => {
    const response = await api.get("/videos", { params });
    return response.data.data;
};

// Get a single video by ID
export const getVideoById = async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data.data;
};

// Upload a new video
export const uploadVideo = async (formData) => {
    const response = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
};

// Update video metadata (title, description, thumbnail)
export const updateVideo = async (videoId, formData) => {
    const response = await api.patch(`/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
};

// Delete a video
export const deleteVideo = async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
};

// Toggle publish status
export const togglePublishStatus = async (videoId) => {
    const response = await api.patch(`/videos/toggle/publish/${videoId}`);
    return response.data.data;
};

// Toggle like on a video
export const toggleVideoLike = async (videoId) => {
    const response = await api.post(`/likes/toggle/v/${videoId}`);
    return response.data;
};

// Toggle subscription to a channel
export const toggleSubscription = async (channelId) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
};
