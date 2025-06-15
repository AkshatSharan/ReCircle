import axiosInstance from "./axiosInstance";

export const register = (formData) => axiosInstance.post("/users/register", formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const addItem = (formData) => axiosInstance.post("/items/add", formData);