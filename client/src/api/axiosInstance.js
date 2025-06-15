import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
});

// Interceptor to attach Firebase token
axiosInstance.interceptors.request.use(
    async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;