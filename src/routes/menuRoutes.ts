import express from "express";
import menuController from "../controllers/menuController";
import { protect } from "../middlewares/protection";

const router = express.Router();
router.use(protect);
router.get("/get-all", menuController.getMenuItems);

export default router;
