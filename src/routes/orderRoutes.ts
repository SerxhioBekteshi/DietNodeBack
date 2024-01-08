import express from "express";
import { protect, restrictTo } from "../middlewares/protection";
import orderController from "../controllers/orderController";
import { eRoles } from "../enums";

const router = express.Router();

router.use(protect);
router.get("/get-all", orderController.getOrders);

router.post(
  "",
  router.use(restrictTo(eRoles.User)),
  orderController.createOrder
);

export default router;