import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please insert all the fields", 404));

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already Exits !", 409));
  }
  const fileUri = getDataUri(file); //convert file format to data url format
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.url,
    },
  });
  sendToken(res, user, "Registerd Successfully !", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("User Doesn't Exist", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler("Incorrect Credintials", 401));

  sendToken(res, user, `Welcome back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      messge: "Logout Successfully !",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please enter all fields !", 401));
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Old password !", 401));
  }
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    messge: "Password changed successfully 👍",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    messge: "Update profile Successfully 👍",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file); //convert file format to link format;
  const mycloud = cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };
  await user.save();

  res.status(200).json({
    success: true,
    messge: "Profile picture updated succesfully !",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found !", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore`;

  //send token via token
  sendEmail(user.email, "Made by me reset password", message);

  res.status(200).json({
    status: true,
    message: `reset token send to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user)
    return next(new ErrorHandler("Token is invalid or has been expired "));

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    status: true,
    message: "password change successfully",
    token,
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found !"), 401);
  }
  if (user.role === "user") user.role = "admin";
  else user.role = "user";

  await user.save();
  res.status(200).json({
    success: true,
    message: "Role updated!",
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new ErrorHandler("User not Found !", 404));

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await user.remove();
  res.status(200).json({
    success: true,
    message: "User deleted successfully !",
  });
});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await user.remove();
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "User Deleted it's Profile" });
});