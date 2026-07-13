import {Router} from "express"
import {
  login,
  registerUser,
  logoutUser,
  generateAccessTokenAndRefreshToken,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
} from "../controllers/authController.js";

import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator , userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../validators/index.validator.js"
import {verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

//unsecure routes
router.route("/register").post(userRegisterValidator(),validate ,registerUser)

router.route("/login").post(userLoginValidator(),validate , login);

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password/").post(userForgotPasswordValidator(), validate , forgotPasswordRequest );

router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate , resetForgotPassword)


//secure routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").post(verifyJWT, getCurrentUser);

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);

router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate,changeCurrentPassword);



export default router