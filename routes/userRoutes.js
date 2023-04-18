import express from "express";
import {
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  updateProfilePicture,
  updateUserRole,
} from "../controller/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

//register
router.route("/register").post(register);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//myProfile
router.route("/me").get(isAuthenticated, getMyProfile);

//delete myProfile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

//password changed
router.route("/changepassword").put(isAuthenticated, changePassword);

//update profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//update profile picture
router
  .route("/updateprofilepicture")
  .put(singleUpload, isAuthenticated, updateProfilePicture);

//forgot password
router.route("/forgotpassword").post(forgotPassword);

//reset password
router.route("/resetpassword/:token").put(resetPassword);

//admin get all users
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

//admin update user role
router
  .route("/admin/users/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);

export default router;
