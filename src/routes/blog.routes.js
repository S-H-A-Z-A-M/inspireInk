import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  editBlog,
  deleteBlogById,
  getBlogById,
  likeBlog,
  countBlogSaves,
} from "../controllers/blog.controller.js";

const router = Router();

router
  .route("/create-blog")
  .post(verifyJWT, upload.single("coverImage"), createBlog);
router.route("/delete-blog/:slug").delete(verifyJWT, deleteBlog);
// router.route("/delete-blog/:id").delete(verifyJWT, deleteBlogById);
// router.route("/blog/:id").get(getBlogById); // if you are the owner then show delete and edit button
router.route("/blog/:slug").get(getBlogBySlug); // if you are the owner then show delete and edit button
router.route("/all-blogs").get(getAllBlogs);
router
  .route("/edit-blog/:oldSlug")
  .patch(verifyJWT, upload.single("coverImage"), editBlog);
router.route("/like-blog/:slug").patch(verifyJWT, likeBlog);
router.route("/count-blog-saves/:postId").get(countBlogSaves);

export default router;
