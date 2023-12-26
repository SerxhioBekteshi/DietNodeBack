import express from "express";
import userRouter from "./userRoutes";
import tableRoutes from "./tableRoutes";
import menuRoutes from "./menuRoutes";
import authRouter from "./authRoutes";
import mealRoutes from "./mealRoutes";
import quizRoutes from "./quizRoutes";
import paymentRoutes from "./paymentRoutes";
import orderRoutes from "./orderRoutes";
import quizResultRoutes from "./userQuizResultRoutes";
import permissionRoutes from "./permissionRoutes";
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
router.use("/permissions", permissionRoutes);

export default router;
