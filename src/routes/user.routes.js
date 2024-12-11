import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import { refreshaccessToken } from "../controllers/user.controllers.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

// Secured Routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshaccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/update-account").patch(verifyJWT, updateUserDetails);

// router
//   .route("/update-avatar")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
// router
//   .route("/update-coverimage")
//   .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);


export default router;
