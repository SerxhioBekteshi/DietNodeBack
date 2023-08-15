import { IFieldAnswers, IQuiz } from "../interfaces/database";
import mongoose, { Schema, model } from "mongoose";
import AutoIncrement from "mongoose-auto-increment";

const quizSchema = new Schema<IQuiz>({
  id: {
    type: Number,
    required: true,
  },
  questionName: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    required: true,
  },
  fieldAnswers: { type: Array<IFieldAnswers>, required: true },
});

AutoIncrement.initialize(mongoose.connection);

quizSchema.plugin(AutoIncrement.plugin, {
  model: "Quiz",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
const Quiz = model("Quiz", quizSchema);

export default Quiz;
