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

const createMeal = createOne(Meal);

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
    cb(null, `meal-pic-${req.user._id}-${Date.now()}.${req.fileType}`);
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

export default {
  createMeal,
  getMeal,
  updateMeal,
  getAllMeals,
  deleteMeal,
  uploadImage,
};
