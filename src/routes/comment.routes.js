import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/comment.controllers.js";

const router = Router();

router.route("/create-comment/:blogId").post(verifyJWT, createComment);
router.route("/get-comments/:blogId").get(getCommentsByBlog);
router.route("/edit-comment/:commentId").patch(verifyJWT, updateComment);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);
router.route("/like-comment/:commentId").patch(verifyJWT, likeComment);

export default router;
