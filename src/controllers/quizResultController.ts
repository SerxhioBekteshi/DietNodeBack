import User from "../models/userModel";
import UserQuizResult from "../models/userQuizResultModel";

const createQuizResultRow = async (req: any, res: any) => {
  req.body.userId = req.user.id;
  const doc = await UserQuizResult.create(req.body);
  const userDoc = await User.findOneAndUpdate(
    { id: req.user.id },
    { quizFulfilled: true }
  );
  res
    .status(200)
    .json({
      doc: doc,
      message: "Quiz results added",
      userAccActivated: userDoc.quizFulfilled,
    });
};

export default {
  createQuizResultRow,
};
