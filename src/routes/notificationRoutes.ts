import express from "express";
import {
  deleteAll,
  markAllRead,
  updateNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/protection";

const router = express.Router();
router.use(protect);
router.post("/markAllRead", markAllRead);
router.post("/deleteAll", deleteAll);
router.route("/:id").patch(updateNotification);

export default router;
