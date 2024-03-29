import multer from "multer";
import Meal from "../models/mealModel";
import {
  deleteOne,
  createOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import MealRating from "../models/mealRatingModel";

// const createMeal = createOne(Meal);

const getMeal = getOne(Meal);

const updateMeal = updateOne(Meal);

const getAllMeals = getAll(Meal);

const deleteMeal = deleteOne(Meal);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/meals");
  },

  filename: function (req: any, file: any, cb: any) {
    req.fileType = file.mimetype.split("/")[1]; // jpg/jpeg or png
    cb(null, `meal-${Date.now()}.${req.fileType}`);
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

const uploadMealImage = async (req: any, res: any, next: any) => {
  if (!req.file) return next(new AppError("No file", 404));

  const meal = await Meal.findOne({ id: req.params.id });
  if (!meal) return next(new AppError("No doc find with that id", 404));

  const image = req.file.path;
  meal.image = image.replace(/ /g, "");

  const result = meal.save();

  if (result) return res.status(200).json({ message: "Update successfully" });
};

const createMeal = catchAsync(async (req: any, res: any) => {
  req.body.providerId = req.user.id;
  const doc = await Meal.create(req.body);
  res.status(200).json({ doc: doc, message: "Created successfully" });
});

const updateMealStock = catchAsync(async (req: any, res: any, next: any) => {
  const doc = await Meal.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError("No doc find with that id", 404));
  }
  return res
    .status(200)
    .json({ doc: doc, message: "Meal stock updated successfully" });
});

const rateMeal = catchAsync(async (req: any, res: any, next: any) => {
  const meal = await Meal.findOne({ id: req.params.id });
  if (!meal) {
    return next(new AppError("No meal found with that id", 404));
  }

  const mealRating = await MealRating.findOne({
    mealId: req.params.id,
    userId: req.user.id,
  });
  if (!mealRating) {
    await MealRating.create({
      mealId: req.params.id,
      userId: req.user.id,
      rating: req.body.rating,
    });
  } else {
    mealRating.rating = req.body.rating;
    await mealRating.save();
  }

  res.status(200).json({
    message: "Meal rated",
  });
});

export default {
  createMeal,
  getMeal,
  updateMeal,
  updateMealStock,
  getAllMeals,
  deleteMeal,
  uploadImage,
  uploadMealImage,
  rateMeal,
};
