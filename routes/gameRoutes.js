import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getWholeGames,
} from "../controller/gameController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

//get all game with seach functionllay imp ----------
router.route("/games").get(getAllGames);

//create games
router
  .route("/creategame")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createGame);

router
  .route("/deletegame/:id")
  .delete(isAuthenticated, authorizeAdmin, deleteGame);

router.route("/getallgames").get(getWholeGames);

export default router;
