import mongoose, { Schema, model } from "mongoose";
import { IMeal } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";
import { IIngredients } from "../interfaces/database/IIngredients";

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
    providerId: {
      type: Number,
      required: true,
      ref: "User",
    },
  }
  // { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

MealSchema.plugin(AutoIncrement.plugin, {
  model: "Meal",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const Meal = model<IMeal>("Meal", MealSchema);

export default Meal;
