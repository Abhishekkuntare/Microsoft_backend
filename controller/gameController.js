import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Game } from "../models/Game.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "cloudinary";

//seach functionally ------- imp -----------
export const getAllGames = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";
  const games = await Game.find({
    title: {
      $regex: keyword,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  });
  res.status(200).json({
    success: true,
    games,
  });
});

export const createGame = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("please add all fields ", 400));

  const file = req.file;
  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Game.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Game created successfully. ",
  });
});

export const deleteGame = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const game = await Game.findById(id);

  if (!game) {
    return next(new ErrorHandler("Game not Found !"), 404);
  }
  await game.remove();
  res.status(200).json({
    success: true,
    message: "Game deleted Successfcully !",
  });
});


export const getWholeGames = catchAsyncError(async(req,res,next)=>{
  const games = await Game.find({})
  res.status(200).json({
    success:true,
    games
  })
})