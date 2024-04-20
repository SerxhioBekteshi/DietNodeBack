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

const getQuiz = getAll(Quiz, { order: 1 });

const deleteQuizRow = deleteOne(Quiz);

const createQuizRow = async (req: any, res: any) => {
  const doc = await Quiz.create(req.body);
  res.status(200).json({ doc: doc, message: "Quiz done successfully" });
};

const updateQuizOrders = async (req: any, res: any, next: any) => {
  const data = req.body.questionNewOrders;
  console.log(data, "DATA");
  try {
    for (const item of data) {
      await Quiz.findOneAndUpdate(
        { id: item.id },
        { $set: { order: item.order } },
        { new: true }
      );

      //  else {
      //   next(
      //     new AppError(
      //       `Quiz with name ${item.fieldName} was not found, stopping updated!`,
      //       404
      //     )
      //   );
      // }
    }
    res.json({ message: "Orders updated successfully" });
  } catch (error: any) {
    console.log(error, "ERA");
    next(
      new AppError(`${error || error?.message} occcured on this server.`, 500)
    );
  }
};
export default {
  createQuizRow,
  getQuizRow,
  updateQuizRow,
  getQuiz,
  deleteQuizRow,
  updateQuizOrders,
};
