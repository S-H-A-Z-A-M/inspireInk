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
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
const commentApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/comments", // Replace with your API base URL
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export { userApi, blogApi, commentApi };
