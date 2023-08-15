import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { protect, restrictTo } from "../middlewares/protection";
import { eRoles } from "../enums";
import { assignTo } from "../middlewares/assignTo";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassowrd);
router.post("/resetpassword", authController.resetPassowrd);

router.use(protect);
router.get("/", userController.getAllUsers);
router.get("/me", userController.getUserDetail);
router.get("/activeUsers", userController.activeUsers);
router.put("/updatePassword", authController.updatePassword);
// TODO:

// 1. allow user to deactivate his user or not
// 2. block user to update his position and other policies
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);
// .patch(patchUser, userController.updateUser);

// TODO: finish implementation
router.post(
  "/image",
  userController.uploadImage.single("image"),
  userController.updateProfileImage
);

router.post("/language", userController.updateLanguage);

// all route handlers below can be accessed from Admin and Manager Roles
router.use(restrictTo(eRoles.Admin));

router.post("/", assignTo, userController.createUserController);

export default router;
