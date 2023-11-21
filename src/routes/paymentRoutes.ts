import express from "express";
import { protect } from "../middlewares/protection";
import paymentController from "../controllers/paymentController";

const router = express.Router();

// router.use(protect);
router.post("/create-order", paymentController.approvePayment);

export default router;
