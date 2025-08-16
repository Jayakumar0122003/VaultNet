import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite refresh loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use plain axios to avoid interceptors
        const { data } = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true } // ✅ correct place
        );

        // Save new access token
        localStorage.setItem("accessToken", data.accessToken);

        // Update the Authorization header
        axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // localStorage.clear();
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;