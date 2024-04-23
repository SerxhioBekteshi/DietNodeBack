import mongoose, { Schema, SchemaTypes, model } from "mongoose";
import { IMeal } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";
import { IIngredients } from "../interfaces/database/IIngredients";
import { INutritionValues } from "../interfaces/database/INutritionValues";
import MealRating from "./mealRatingModel";

const MealSchema = new Schema<IMeal>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    ingredients: { type: Array<IIngredients>, required: false, default: [] },
    cousine: {
      //
      type: String,
      required: true,
    },
    carbonFootprint: {
      type: Number,
      required: false,
    },
    dietCategory: {
      //
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    nutritionValues: {
      type: Array<INutritionValues>,
      required: false,
      default: [],
    },
    calories: {
      type: Number,
      required: true,
    },
    achievement: {
      type: String,
      required: false,
    },
    intolerance: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
      default: "public/images/meals/default.jpeg",
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    providerId: {
      type: Number,
      required: true,
      ref: "User",
    },
  }
  // { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

MealSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  await MealRating.deleteMany({ mealId: doc.id }).exec();
  next();
});

MealSchema.plugin(AutoIncrement.plugin, {
  model: "Meal",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Meal = model<IMeal>("Meal", MealSchema);

export default Meal;
