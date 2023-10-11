import multer from "multer";
import {
  deleteOne,
  createOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";
import { AppError } from "../utils/appError";
import Quiz from "../models/quizModel";

// const createMeal = createOne(Meal);

const getQuizRow = getOne(Quiz);

const updateQuizRow = updateOne(Quiz);

const getQuiz = getAll(Quiz);

const deleteQuizRow = deleteOne(Quiz);

const createQuizRow = async (req: any, res: any) => {
  const doc = await Quiz.create(req.body);
  res.status(200).json({ doc: doc, message: "Quiz done successfully" });
};

export default {
  createQuizRow,
  getQuizRow,
  updateQuizRow,
  getQuiz,
  deleteQuizRow,
};
