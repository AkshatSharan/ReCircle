import axiosInstance from "./axiosInstance";

export const register = (formData) => axiosInstance.post("/users/register", formData);

export const addItem = (formData) => axiosInstance.post("/items/add", formData);