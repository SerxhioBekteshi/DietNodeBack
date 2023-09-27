import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { protect, restrictTo } from "../middlewares/protection";
import { eRoles } from "../enums";
import { assignTo } from "../middlewares/assignTo";
// import patchUser from '../middlewares/patchUser';

const router = express.Router();

router.post("/register", authController.register);
router.post("/registerProvider", authController.registerProvider);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassowrd);
router.post("/resetpassword", authController.resetPassowrd);

router.use(protect);
router.get("/", userController.getAllUsers);
router.get("/me", userController.getUserDetail);

router.get("/providers/get-all", userController.getProviders);
router.put(
  "/provider/controlSubmission/:id",
  userController.submitUnsubmitProvider
);

router.put("/updatePassword", authController.updatePassword);

router.put("/update", userController.updateLoggedUser);
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

// router.post("/language", userController.updateLanguage);

// all route handlers below can be accessed from Admin and Manager Roles
router.use(restrictTo(eRoles.Admin, eRoles.Provider));

router.post("/", assignTo, userController.createUserController);

export default router;
