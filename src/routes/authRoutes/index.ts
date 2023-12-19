import express from "express";
import authController from "../../controllers/authController";
import { protect } from "../../middlewares/protection";

const router = express.Router();

router.post("/refresh", authController.refreshAccessToken);
// router.post("/googlelogin", authController.googleLogin);

router.use(protect);
router.post("/changePassword", authController.changePassword);
router.post("/confirm", authController.confirmEmail);
router.post("/resendEmailConfirmation", authController.resendEmailConfirmation);
router.post("/sendEmailTemplateToRegister", authController.sendEmailToRegister);

export default router;
