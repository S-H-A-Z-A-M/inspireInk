import { Router } from "express";

import {
  getUsers,
  getCurrentUser,
  getBlogs,
  getUser,
  getBlog,
  grantAdminRights,
  revokeAdminRights,
  deleteUser,
  deleteBlog,
  loginUser,
  googlelogin,
  logout,
  dashboard,
} from "../controllers/admin.controller.js";
import {
  adminAuth,
  superAdminAuth,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/dashboard").get(dashboard);

router.route("/login").post(loginUser);
router.route("/googlelogin").post(googlelogin);

// admin auth is required here
router.route("/getUsers").get(verifyJWT, adminAuth, getUsers);
router.route("/getBlogs").get(verifyJWT, adminAuth, getBlogs);
router.route("/getUser/:username").get(verifyJWT, adminAuth, getUser);
router.route("/getUser").get(verifyJWT, adminAuth, getCurrentUser);
router.route("/getBlog/:slug").get(verifyJWT, adminAuth, getBlog);
router.route("/deleteUser/:username").delete(verifyJWT, adminAuth, deleteUser);
router.route("/deleteBlog/:slug").delete(verifyJWT, adminAuth, deleteBlog);
router.route("/logout").post(verifyJWT, logout);

//superadmin auth is required here
router
  .route("/grant/:username")
  .patch(verifyJWT, superAdminAuth, grantAdminRights);
router
  .route("/revoke/:username")
  .patch(verifyJWT, superAdminAuth, revokeAdminRights);
export default router;
