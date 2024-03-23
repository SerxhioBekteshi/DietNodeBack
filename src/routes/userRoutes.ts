import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { protect, restrictTo } from "../middlewares/protection";
import { eRoles } from "../enums";
import { assignTo } from "../middlewares/assignTo";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

//this routes can be access by anyone
router.post("/register", authController.register);
router.post("/registerProvider", authController.registerProvider);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassowrd);
router.post("/resetpassword", authController.resetPassowrd);

//routes below can be accessed only if you are logged in or if you have permission

router.get("/", protect, userController.getAllUsers);
router.get("/me", protect, userController.getUserDetail);
router.put("/updatePassword", protect, authController.updatePassword);
router.put("/update", protect, userController.updateLoggedUser);
router.get("/loggedUser", protect, userController.getLoggedUser);

router
  .route("/:id")
  .get(protect, userController.getUser)
  .delete(protect, userController.deleteUser);

router.put(
  "/image",
  protect,
  userController.uploadImage.single("image"),
  protect,
  userController.updateProfileImage
);

// all route handlers below can be accessed from Admin
router.get(
  "/providers/get-all",
  protect,
  restrictTo(eRoles.Admin),
  userController.getProviders
);
router.put(
  "/provider/controlSubmission/:id",
  protect,
  restrictTo(eRoles.Admin),
  userController.submitUnsubmitProvider
);

export default router;
