import express from "express";
import { appRequest, contact, gameRequest } from "../controller/otherController.js";

const router = express.Router();

router.route("/contact").post(contact);

router.route("/apprequest").post(appRequest);
router.route("/gamerequest").post(gameRequest);

export default router;
