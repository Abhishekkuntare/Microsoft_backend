import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

//Contact
export const contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("Please Enter all fields !", 401));
  }

  const to = process.env.MY_MAIL;
  const subject = "Contact from Abhishek Kuntare";
  const text = `i am ${name} and my email is ${email}. \n${message}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your message has been send!",
  });
});

//App request
export const appRequest = catchAsyncError(async (req, res, next) => {
  const { name, email, apps } = req.body;

  if (!name || !email || !apps) {
    return next(new ErrorHandler("Please enter all fields !"), 400);
  }
  const to = process.env.MY_MAIL;
  const subject = "Request for the new apps on your platform";
  const text = `I am ${name} my email is ${email}.\n ${apps}`;

  await sendEmail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your request has been sent",
  });
});

export const gameRequest = catchAsyncError(async (req, res, next) => {
  const { name, email, game } = req.body;
  if (!name || !email || !game) {
    return next(new ErrorHandler("Please enter all fields !"), 401);
  }
  const to = process.env.MY_MAIL;
  const subject = "Request for a newgames on your platform";
  const text = `I am ${name}.My email is ${email}. \n${game}`;

  await sendEmail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your request has been sent",
  });
});
