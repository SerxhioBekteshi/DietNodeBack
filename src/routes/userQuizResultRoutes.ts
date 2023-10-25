import express from "express";
import { protect, restrictTo } from "../middlewares/protection";
import userQuizController from "../controllers/quizResultController";
import { eRoles } from "../enums";

const router = express.Router();

router.use(protect);
router.use(restrictTo(eRoles.Admin, eRoles.User));
router.post("", userQuizController.createQuizResultRow);

export default router;
