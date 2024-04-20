import User from "../models/userModel";
import UserQuizResult from "../models/userQuizResultModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
// import { getAll } from "./handleFactory";
import socketManager from "../../socket";
import { eRoles } from "../enums";

const createQuizResultRow = async (req: any, res: any) => {
  req.body.userId = req.user.id;
  const doc = await UserQuizResult.create(req.body);
  const userDoc = await User.findOneAndUpdate(
    { id: req.user.id },
    { quizFulfilled: true }
  );
  res.status(200).json({
    doc: doc,
    message: "Quiz results added",
    userAccActivated: userDoc.quizFulfilled,
  });
};

const getQuizResultsForLoggedUser = catchAsync(
  async (req: any, res: any, next: any) => {
    socketManager.sendAppNotificationToAdmin(
      "A quiz results request was made",
      1,
      req.user.id,
      "New request",
      // `/quizResults/${req.user.id}`, ->> kjo nuk supozohet te navigoj??
      "",
      eRoles.Admin
    );
    res.status(200).json({ message: "Request was made" });
  }
);

const handleChangeResults = catchAsync(
  async (req: any, res: any, next: any) => {
    const doc = await UserQuizResult.findOne({ userId: req.user.id });
    if (!doc) {
      return next(new AppError("No quiz result for this user ", 404));
    }
    res.status(200).json(doc.quizResult);
  }
);

export default {
  createQuizResultRow,
  getQuizResultsForLoggedUser,
};
