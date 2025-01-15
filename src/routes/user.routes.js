import { Router } from "express";
import {
  loginUser,
  registerUser,
  googleRegister,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  saveBlog,
  getAllBlogsByUser,
  getAllSavedBlogs,
  getUser,
} from "../controllers/user.controllers.js";
import { refreshaccessToken } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/google/auth").post(googleRegister);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshaccessToken);
router.route("/get-user/:userId").get(getUser);

// Secured Routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/update-account").patch(verifyJWT, updateUserDetails);

// router
//   .route("/update-profile-pic")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// router.route("/user-dashboard").get(verifyJWT, getUserDashboard);
router.route("/save-blog/:postId").patch(verifyJWT, saveBlog);
router.route("/all-saved-blogs/:userId").get(verifyJWT, getAllSavedBlogs);
router.route("/all-user-blogs/:userId").get(getAllBlogsByUser);

export default router;
