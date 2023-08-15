import User from "../models/userModel";
import {
  deleteOne,
  createOne,
  getAll,
  getOne,
  updateOne,
  getUserByTokenId,
} from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import multer from "multer";
import { AppError } from "../utils/appError";
import deleteFile from "../utils/deleteFile";
// import HolidayConfig from "../models/holidayConfig";

const createUser = createOne(User);

const getUser = getOne(User);

const getUserDetail = getUserByTokenId(User);

const updateUser = updateOne(User);

const getAllUsers = getAll(User);

const deleteUser = deleteOne(User);

const activeUsers = async (req: any, res: any, next: any) => {
  const usersCount = await User.countDocuments({ customer: req.user.customer });
  res.json(usersCount);
};
// TODO: refactor image upload for

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },

  filename: function (req: any, file: any, cb: any) {
    req.fileType = file.mimetype.split("/")[1]; // jpg/jpeg or png
    cb(null, `user-profile-pic-${req.user._id}-${Date.now()}.${req.fileType}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};
const uploadImage = multer({ storage: storage, fileFilter: fileFilter });

// TODO: implement resize
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat(req.fileType)
  //   .toFile(`${req.file.destination}/${req.file.filename}`);

  next();
});

const updateProfileImage = async (req, res, next) => {
  if (!req.file) return next();

  await User.findByIdAndUpdate(
    { _id: req.user._id },
    { photo: req.file.filename }
  );
  await deleteFile(`public/images/users/${req.user.photo}`);

  res.status(200).json({ fileName: req.file.filename });
};

const createUserController = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json(newUser);
});

const updateLanguage = catchAsync(async (req, res, next) => {
  const filter = { _id: req.user._id };
  const updateStatus = await User.updateOne(filter, {
    language: req.body.language,
  });
  res.json(updateStatus.ok);
});

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserDetail,
  activeUsers,
  uploadImage,
  updateProfileImage,
  createUserController,
  resizeUserPhoto,
  updateLanguage,
};
