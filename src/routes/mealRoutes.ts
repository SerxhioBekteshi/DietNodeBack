import express from "express";
import mealController from "../controllers/mealController";
import { protect, restrictTo } from "../middlewares/protection";
import { assignTo } from "../middlewares/assignTo";
import { eRoles } from "../enums";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

router.use(protect);
router.get(
  "/get-all",
  restrictTo(eRoles.User, eRoles.Provider),
  mealController.getAllMeals
);

router.put("/rate/:id", restrictTo(eRoles.User), mealController.rateMeal);

router.use(restrictTo(eRoles.Provider));
router.post("", mealController.createMeal);
router
  .route("/:id")
  .get(mealController.getMeal)
  .put(mealController.updateMeal)
  .delete(mealController.deleteMeal);

router.put("/stock/:id", mealController.updateMealStock);

router.put(
  "/image/:id",
  mealController.uploadImage.single("image"),
  mealController.uploadMealImage
);

export default router;
