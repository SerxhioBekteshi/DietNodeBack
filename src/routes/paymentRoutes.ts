import express from "express";
import { protect } from "../middlewares/protection";
import paymentController from "../controllers/paymentController";

const router = express.Router();

router.use(protect);
router.get("/process-payment", paymentController.approvePayment);

export default router;
