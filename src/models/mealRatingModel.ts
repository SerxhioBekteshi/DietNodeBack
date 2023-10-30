import mongoose, { Schema, model } from "mongoose";
import { IMealRating } from "../interfaces/database";
import AutoIncrement from "mongoose-auto-increment";

const MealRatingSchema = new Schema<IMealRating>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      ref: "User",
      required: true,
    },
    mealId: {
      type: Number,
      ref: "Meal",
      required: true,
    },
  }
  // { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

MealRatingSchema.plugin(AutoIncrement.plugin, {
  model: "MealRating",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const MealRating = model<IMealRating>("MealRating", MealRatingSchema);

export default MealRating;
