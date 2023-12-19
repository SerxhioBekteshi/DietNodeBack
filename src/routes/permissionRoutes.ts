import express from "express";
import permissionController from "../controllers/permissionController";
import { protect, restrictTo } from "../middlewares/protection";
import { assignTo } from "../middlewares/assignTo";
import { eRoles } from "../enums";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

router.use(protect);
router.use(restrictTo(eRoles.Admin));
router.post("", permissionController.createPermission);
router
  .route("/:id")
  .get(permissionController.getPermission)
  .put(permissionController.updatePermission)
  .delete(permissionController.deletePermission);

export default router;
