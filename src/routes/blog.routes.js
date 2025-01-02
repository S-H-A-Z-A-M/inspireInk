import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  getAllBlogsByUser,
  editBlog,
  deleteBlogById,
  getBlogById,
} from "../controllers/blog.controller.js";

const router = Router();

router
  .route("/create-blog")
  .post(verifyJWT, upload.single("coverImage"), createBlog);
router.route("/delete-blog/:slug").delete(verifyJWT, deleteBlog);
router.route("/delete-blog/:id").delete(verifyJWT, deleteBlogById);
router.route("/blog/:slug").get(getBlogById); // if you are the owner then show delete and edit button
router.route("/blog/:id").get(getBlogBySlug); // if you are the owner then show delete and edit button
router.route("/all-blogs").get(getAllBlogs);
router.route("/my-blogs/:userId").get(getAllBlogsByUser);
router.route("/edit-blog/:slug").patch(verifyJWT, editBlog);

export default router;
