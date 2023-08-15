import express from "express";
import userRouter from "./userRoutes";
import tableRoutes from "./tableRoutes";
import menuRoutes from "./menuRoutes";
import authRouter from "./authRoutes";

const router = express.Router();

router.use("/authentication", authRouter);
router.use("/user", userRouter);
router.use("/menu", menuRoutes);

export default router;
