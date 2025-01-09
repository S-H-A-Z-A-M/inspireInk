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
    console.log(response) 
    return response},
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await userApi
          .post("/refresh-token")
          .then((newToken) => {
            return userApi(originalRequest);
          });
      } catch (refreshError) {
        console.log("Refresh Token Expired:", refreshError);
        // window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  }
);

export { userApi, blogApi, commentApi };
