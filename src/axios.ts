import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/users",
  withCredentials: true, // this line made possible to have the cookie stored in the browser
  headers: {
    "Content-Type": "application/json",
  },
});
const blogApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/blogs", // Replace with your API base URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
const commentApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/comments", // Replace with your API base URL
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

userApi.interceptors.response.use(
  (response) => {
    // Simply return the response if there's no error
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.data.message === "jwt expired" &&
      error.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh-token endpoint (cookie will be automatically sent)
        await userApi.post("/refresh-token");
        console.log("access token generated successfully");
        // Retry the original request
        return userApi(originalRequest);
      } catch (refreshError) {
        console.log("Refresh Token Expired:", refreshError);
        // Redirect to login page or handle logout
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the original error
    return Promise.reject(error);
  }
);

blogApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.data.message === "jwt expired" &&
      error.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await userApi.post("/refresh-token"); // Refresh token using userApi
        return blogApi(originalRequest); // Retry the request using blogApi
      } catch (refreshError) {
        console.log("Refresh Token Failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Apply the interceptor to the commentApi instance as well
commentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.data.message === "jwt expired" &&
      error.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await userApi.post("/refresh-token"); // Refresh token using userApi
        return commentApi(originalRequest); // Retry the request using commentApi
      } catch (refreshError) {
        console.log("Refresh Token Failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export { userApi, blogApi, commentApi };
