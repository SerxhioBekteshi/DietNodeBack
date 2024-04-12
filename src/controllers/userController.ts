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
import Order from "../models/orderModel";
import UserQuizResult from "../models/userQuizResultModel";
import { FilterQuery } from "mongoose";
// import HolidayConfig from "../models/holidayConfig";

const createUser = createOne(User);

const getUser = catchAsync(async (req: any, res: any, next: any) => {
  try {
    const user = await User.findOne({ id: req.params.id }).lean();

    if (!user) {
      return next(new AppError("Could not get the current logged user", 404));
    }

    const ordersByMonth = await getOrdersByLast12Months(user, next);

    if (user.role === eRoles.Provider) {
      //show a raport for this orders meals and stuff
    } else if (user.role === eRoles.User) {
      const numberOfOrders = await Order.find({
        userId: user.id as FilterQuery<number>,
      }).countDocuments();
      const quizResults = await UserQuizResult.findOne({
        userId: user.id as FilterQuery<number>,
      });
      const aclPermissions = await getPermissionForLoggedUser(user, next);
      user["numberOfOrders"] = numberOfOrders;
      user["quizResults"] = quizResults;
      user["accessPermissions"] = aclPermissions;
      user["orders"] = ordersByMonth;
      // const newUser = { ...user.toObject(), accessPermissions: aclPermissions };
      // res.status(200).json(newUser);
    }
    res.status(200).json(user);
  } catch (err: any) {
    return next(new AppError(err, 500));
  }
});
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

    const newUser = {
      ...user.toObject(),
      accessPermissions: aclPermissions,
    };

    if (user.role !== eRoles.Admin) {
      const ordersByMonth = await getOrdersByLast12Months(user, next);
      newUser["orders"] = ordersByMonth;
    }

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

const getOrdersByLast12Months = async (user: any, next: any) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const matchStage = {
    $match: {
      createdAt: { $gte: twelveMonthsAgo },
    },
  };

  if (user.role === eRoles.Provider) {
    matchStage.$match["mealDetails.providerId"] = user.id;
  } else {
    matchStage.$match["userId "] = user.id;
  }

  console.log(matchStage, "ADAWD");

  try {
    const result = await Order.aggregate([
      matchStage,
      // { $unwind: "$meals" },
      // {
      //   $lookup: {
      //     from: "Meal",
      //     localField: "meals",
      //     foreignField: "_id",
      //     as: "mealDetails",
      //   },
      // },
      // { $unwind: "$mealDetails" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            // providerId: "$mealDetails.providerId",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
    ]);

    const months = [];
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push({
        _id: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          monthName: monthNames[date.getMonth()],
        },
        count: 0,
      });
    }

    // Left join the aggregated results with the months array
    const mergedResult = months.map((month) => {
      const matchingResult = result.find(
        (r) => r._id.year === month._id.year && r._id.month === month._id.month
      );
      return matchingResult
        ? { ...matchingResult, _id: { ...month._id } }
        : month;
    });

    // Sort the final result from oldest to most recent date
    mergedResult.sort((a, b) => {
      const dateA = new Date(a._id.year, a._id.month - 1).getTime();
      const dateB = new Date(b._id.year, b._id.month - 1).getTime();
      return dateA - dateB;
    });

    console.log(mergedResult);

    return mergedResult;
  } catch (error: any) {
    return next(new AppError(error, 500));
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
