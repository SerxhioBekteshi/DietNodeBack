import express from 'express';
import menuController from '../controllers/menuController';
import { protect } from '../middlewares/protection';

const router = express.Router();
router.use(protect);
router.get('/', menuController.getMenus);

export default router;
