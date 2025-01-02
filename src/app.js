import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173" || process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

// // routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

export { app };