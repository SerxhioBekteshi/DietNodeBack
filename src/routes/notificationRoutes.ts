import express from "express";
import {
  deleteAll,
  markAllRead,
  markAsRead,
  updateNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/protection";

const router = express.Router();
router.use(protect);
router.post("/markAllRead", markAllRead);
router.post("/deleteAll", deleteAll);
router.route("/:id").patch(updateNotification);
router.put("/:id", markAsRead);

export default router;
