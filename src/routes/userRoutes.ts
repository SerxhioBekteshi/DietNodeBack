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
router.use(protect);
router.get("/", userController.getAllUsers);
router.get("/me", userController.getUserDetail);

router.put("/updatePassword", authController.updatePassword);
router.put("/update", userController.updateLoggedUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.post(
  "/image",
  userController.uploadImage.single("image"),
  userController.updateProfileImage
);

// all route handlers below can be accessed from Admin
router.use(restrictTo(eRoles.Admin));
router.get("/providers/get-all", userController.getProviders); //getting the providers
router.put(
  //controlling their account submission after registering
  "/provider/controlSubmission/:id",
  userController.submitUnsubmitProvider
);

export default router;
