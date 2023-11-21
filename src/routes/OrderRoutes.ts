import express from "express";
import { protect, restrictTo } from "../middlewares/protection";
import orderController from "../controllers/orderController";

const router = express.Router();

router.use(protect);
router.get("/get-all", orderController.getOrders);

router.post("", orderController.createOrder);

export default router;
