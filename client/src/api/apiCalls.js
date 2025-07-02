import axiosInstance from "./axiosInstance";

export const register = (formData) => axiosInstance.post("/users/register", formData);

export const addItem = (formData) => axiosInstance.post("/items/add", formData);

export const getAllItems = (currentUserUid) =>
    axiosInstance.get(`/items?excludeUser=${currentUserUid}`);

export const getUser = (uid) => axiosInstance.get(`/users/${uid}`);

export const getUserAchievements = (uid) => axiosInstance.get(`/users/${uid}/achievements`);

export const uploadUserAvatar = (uid, formData) => axiosInstance.post(`/users/update/${uid}/avatar`, formData);

export const toggleLikeItem = (itemId, uid) => axiosInstance.post(`/items/${itemId}/like`, { uid });

export const updateUserProfile = (uid, profileData) => axiosInstance.put(`/users/update/${uid}`, profileData);