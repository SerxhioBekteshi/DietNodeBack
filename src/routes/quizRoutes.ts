import express from "express";
import { protect, restrictTo } from "../middlewares/protection";
import quizController from "../controllers/quizController";
import { eRoles } from "../enums";

const router = express.Router();

router.use(protect);
router.get("/get-all", quizController.getQuiz);

router.use(restrictTo(eRoles.Admin));
router.post("", quizController.createQuizRow);
router
  .route("/:id")
  .get(quizController.getQuizRow)
  .put(quizController.updateQuizRow)
  .delete(quizController.deleteQuizRow);

export default router;
