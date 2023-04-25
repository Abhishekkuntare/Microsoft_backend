import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Apps } from "../models/Apps.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "cloudinary";

export const createApp = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new ErrorHandler("Please add all fields ", 400));
  }

    const file = req.file;
    const fileUri = getDataUri(file);

    const mycloud = cloudinary.v2.uploader.upload(fileUri.content);

    await Apps.create({
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
    message: "App created successfully. ",
  });
});

export const searchApp = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";

  const apps = await Apps.find({
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
    apps,
  });
});

export const deleteApp = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const apps = await Apps.findById(id);

  if (!apps) {
    return next(new ErrorHandler("App not found !"));
  }

  await apps.remove();
  res.status(200).json({
    success: true,
    message: "App deleted successfully !",
  });
});


export const getWholeApps = catchAsyncError(async(req,res,next)=>{
  const apps = await Apps.find({})
  res.status(200).json({
    success:true,
    apps
  })
})