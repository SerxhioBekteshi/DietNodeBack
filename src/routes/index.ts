import express from "express";
import userRouter from "./userRoutes";
import menuRoutes from "./menuRoutes";
import authRouter from "./authRoutes";
import mealRoutes from "./mealRoutes";
const router = express.Router();

router.use("/authentication", authRouter);
router.use("/user", userRouter);
router.use("/menu", menuRoutes);
router.use("/meal", mealRoutes);

export default router;
