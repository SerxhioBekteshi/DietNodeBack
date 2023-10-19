import mongoose, { Schema, model } from "mongoose";
import AutoIncrement from "mongoose-auto-increment";
import { IUserQuizResult } from "../interfaces/database/IUserQuizResult";

const userQuizResult = new Schema<IUserQuizResult>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
      ref: "User",
    },
    quizResult: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
AutoIncrement.initialize(mongoose.connection);

userQuizResult.plugin(AutoIncrement.plugin, {
  model: "UserQuizResult",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const UserQuizResult = model("UserQuizResult", userQuizResult);

export default UserQuizResult;
