import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";
import { createApp, deleteApp, getWholeApps, searchApp } from "../controller/appController.js";

const router = express.Router();

router
  .route("/createapp")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createApp);

router.route("/apps").get(searchApp);

router.route("/deleteapp/:id").delete(isAuthenticated,authorizeAdmin,deleteApp);
router.route("/getallapps").get(getWholeApps);

export default router;
