import express from "express";
import mealController from "../controllers/mealController";
import { protect, restrictTo } from "../middlewares/protection";
import { assignTo } from "../middlewares/assignTo";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

router.use(protect);
router.get("/get-all", mealController.getAllMeals);
router.post("", mealController.createMeal);
router
  .route("/:id")
  .get(mealController.getMeal)
  .put(mealController.updateMeal)
  .delete(mealController.deleteMeal);

router.put(
  "/image/:id",
  mealController.uploadImage.single("image"),
  mealController.uploadMealImage
);
router.put("/rate/:id", mealController.rateMeal);
// all route handlers below can be accessed from Admin and Manager Roles
// router.use(restrictTo(eRoles.Admin));

// router.post("/", assignTo, userController.createUserController);

export default router;
