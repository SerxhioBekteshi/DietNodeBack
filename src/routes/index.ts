import express from "express";
import userRouter from "./userRoutes";
import tableRoutes from "./tableRoutes";
import menuRoutes from "./menuRoutes";
import authRouter from "./authRoutes";
import mealRoutes from "./mealRoutes";
import quizRoutes from "./quizRoutes";
import paymentRoutes from "./paymentRoutes";
import orderRoutes from "./OrderRoutes";
import quizResultRoutes from "./userQuizResultRoutes";
const router = express.Router();

router.use("/authentication", authRouter);
router.use("/user", userRouter);
router.use("/menu", menuRoutes);
router.use("/meals", mealRoutes);
router.use("/quiz", quizRoutes);
router.use("/table", tableRoutes);
router.use("/quizResult", quizResultRoutes);
router.use("/payment", paymentRoutes);
router.use("/order", orderRoutes);

export default router;
