import express from "express";
import {
  markAllRead,
  updateNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/protection";

const router = express.Router();
router.use(protect);
router.post("/markAllRead", markAllRead);
router.route("/:id").patch(updateNotification);

export default router;
