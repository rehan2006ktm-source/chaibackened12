import api from "./api";

// Get dashboard channel stats (views, likes, subscribers, videos)
export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data.data;
};

// Get all videos for the logged-in user's channel
export const getDashboardVideos = async () => {
    const response = await api.get("/dashboard/videos");
    return response.data.data;
};
