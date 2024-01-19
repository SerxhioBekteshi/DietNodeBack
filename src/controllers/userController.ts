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
import { getPermissionForLoggedUser, isObjEmpty } from "../utils";
import { eRoles } from "../enums";
import { APIFeatures } from "../utils/apiFeatures";
// import HolidayConfig from "../models/holidayConfig";

const createUser = createOne(User);

const getUser = getOne(User);

const getUserDetail = getUserByTokenId(User);

const updateUser = updateOne(User);

const getAllUsers = getAll(User);

const deleteUser = deleteOne(User);

const getLoggedUser = catchAsync(async (req: any, res: any, next: any) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return next(new AppError("Could not get the current logged user", 404));
    }

    const aclPermissions = await getPermissionForLoggedUser(user, next);
    const newUser = { ...user.toObject(), accessPermissions: aclPermissions };
    res.status(200).json(newUser);
  } catch (err: any) {
    return next(new AppError(err, 500));
  }
});

const getProviders = async (req: any, res: any, next: any) => {
  const features = new APIFeatures(
    User.find({ role: eRoles.Provider }),
    req.query
  )
    .filter()
    .sort()
    .limitFiels()
    .pagination();

  const doc = await features.query;

  const notSubmittedAccounts = doc.filter(
    (account: any) => account.accountSubmitted === false
  );
  const submittedAccounts = doc.filter(
    (account: any) => account.accountSubmitted === true
  );

  res.status(200).json({ notSubmittedAccounts, submittedAccounts });
};

const submitUnsubmitProvider = async (req: any, res: any, next: any) => {
  const provider = await User.findOne({ id: req.params.id });
  if (!provider) {
    return next(new AppError("No provider found with that id", 404));
  } else {
    if (req.body.submit) provider.accountSubmitted = true;
    else {
      provider.accountSubmitted = false;
    }
    await provider.save();
    res.status(200).json({
      message: `Account ${req.body.submit ? "submitted" : "unsubmitted"}`,
      account: provider,
    });
  }
};
// TODO: refactor image upload for
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },

  filename: function (req: any, file: any, cb: any) {
    req.fileType = file.mimetype.split("/")[1];
    cb(null, `user-profile-pic-${req.user._id}.${req.fileType}`);
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

const updateProfileImage = async (req: any, res: any, next: any) => {
  if (!req.file) return next();

  const currentLoggedUser = await User.findById({ _id: req.user._id });
  if (!currentLoggedUser)
    return next(new AppError("No doc find with that id", 404));

  const image = req.file.path;
  currentLoggedUser.image = image.replace(/ /g, "");

  const result = currentLoggedUser.save();
  if (result) return res.status(200).json({ message: "Update successfully" });

  // if (req.user.image !== "default.jpg")
  //   await deleteFile(`public/images/users/${req.user.image}`);

  res.status(200).json({
    message: "Image updated successfully",
  });
};

const updateLoggedUser = async (req: any, res: any, next: any) => {
  if (isObjEmpty(req.body)) {
    return next(new AppError("There are no data for updating the user.", 400));
  } else {
    const user = await User.findOneAndUpdate({ id: req.user.id }, req.body, {
      new: true,
    });
    if (!user) {
      return next(
        new AppError("Could not update your data, something went wrong", 500)
      );
    }
    res
      .status(200)
      .json({ user: user, message: "Your data were updated succesfully" });
  }
};

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserDetail,
  getLoggedUser,
  getProviders,
  submitUnsubmitProvider,
  uploadImage,
  updateProfileImage,
  resizeUserPhoto,
  updateLoggedUser,
};
