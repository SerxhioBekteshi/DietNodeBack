import { IFieldAnswers, IQuiz } from "../interfaces/database";
import mongoose, { Schema, model } from "mongoose";
import AutoIncrement from "mongoose-auto-increment";

const quizSchema = new Schema<IQuiz>({
  id: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  questionOptions: { type: Array<IFieldAnswers>, required: true },
  order: { type: Number, required: true },
  fieldName: { type: String, required: true },
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
