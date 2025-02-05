import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
import commentRouter from "./routes/comment.routes.js";
// import imageRouter from "./routes/image.routes.js";

// // routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/images", imageRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

export { app };
