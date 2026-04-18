import { http } from "./http";

export const authApi = {
  register: (formData) => http.post("/users/register", formData),
  login: (payload) => http.post("/users/login", payload),
  logout: () => http.post("/users/logout"),
  getCurrentUser: () => http.get("/users/current-user"),
  getHistory: () => http.get("/users/history"),
  getChannelByUsername: (username) => http.get(`/users/c/${username}`),
  updateAccount: (payload) => http.patch("/users/update-account", payload),
  changePassword: (payload) => http.post("/users/change-password", payload),
  updateAvatar: (formData) => http.patch("/users/avatar", formData),
  updateCoverImage: (formData) => http.patch("/users/coverImage", formData),
};

export const videoApi = {
  getFeed: (page = 1, limit = 12) => http.get(`/videos?page=${page}&limit=${limit}`),
  getById: (videoId) => http.get(`/videos/${videoId}`),
  upload: (formData) => http.post("/videos", formData),
  update: (videoId, formData) => http.patch(`/videos/${videoId}`, formData),
  remove: (videoId) => http.delete(`/videos/${videoId}`),
  togglePublish: (videoId) => http.patch(`/videos/toggle/publish/${videoId}`),
};

export const commentApi = {
  list: (videoId) => http.get(`/comments/${videoId}`),
  add: (videoId, payload) => http.post(`/comments/${videoId}`, payload),
  update: (commentId, payload) => http.patch(`/comments/c/${commentId}`, payload),
  remove: (commentId) => http.delete(`/comments/c/${commentId}`),
};

export const likeApi = {
  toggleVideo: (videoId) => http.post(`/likes/toggle/v/${videoId}`),
  toggleComment: (commentId) => http.post(`/likes/toggle/c/${commentId}`),
  toggleTweet: (tweetId) => http.post(`/likes/toggle/t/${tweetId}`),
  likedVideos: () => http.get("/likes/videos"),
};

export const subscriptionApi = {
  toggle: (channelId) => http.post(`/subscriptions/c/${channelId}`),
  listMine: () => http.get("/subscriptions/c/me"),
  getSubscribers: (channelId) => http.get(`/subscriptions/u/${channelId}`),
};

export const dashboardApi = {
  stats: () => http.get("/dashboard/stats"),
  videos: () => http.get("/dashboard/videos"),
};

export const tweetApi = {
  create: (payload) => http.post("/tweets", payload),
  byUser: (userId) => http.get(`/tweets/user/${userId}`),
  update: (tweetId, payload) => http.patch(`/tweets/${tweetId}`, payload),
  remove: (tweetId) => http.delete(`/tweets/${tweetId}`),
};

export const healthApi = {
  check: () => http.get("/healthcheck"),
};
