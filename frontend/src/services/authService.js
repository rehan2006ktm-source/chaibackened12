import api from "./api";

// Register a new user
export const registerUser = async (formData) => {
    const response = await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Login user
export const loginUser = async ({ email, username, password }) => {
    const response = await api.post("/users/login", {
        email: email || undefined,
        username: username || undefined,
        password,
    });
    return response.data.data; // { user, accessToken, refreshToken }
};

// Logout user
export const logoutUser = async () => {
    const response = await api.post("/users/logout");
    return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
    const response = await api.get("/users/current-user");
    return response.data.data;
};

// Update account details
export const updateAccountDetails = async ({ fullname, email }) => {
    const response = await api.patch("/users/update-account", { fullname, email });
    return response.data.data;
};

// Change password
export const changePassword = async ({ oldPassword, newPassword }) => {
    const response = await api.post("/users/change-password", { oldPassword, newPassword });
    return response.data;
};

// Update avatar
export const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.patch("/users/avatar", formData);
    return response.data.data;
};

// Update cover image
export const updateCoverImage = async (file) => {
    const formData = new FormData();
    formData.append("coverImage", file);
    const response = await api.patch("/users/cover-image", formData);
    return response.data.data;
};

// Get channel profile by username
export const getChannelProfile = async (username) => {
    const response = await api.get(`/users/c/${username}`);
    return response.data.data;
};
