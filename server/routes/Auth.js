import express from "express";
import {
  SignIn,
  SignUp,
  createResetSession,
  generateOTP,
  googleAuthSignIn,
  resetPassword,
  verifyOTP,
} from "../controllers/Auth.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
//google signin
router.post("/google", googleAuthSignIn);
//generate otp
router.get("/generate-otp", generateOTP);
//verify opt
router.get("/verify-otp", verifyOTP);
//create reset session
router.get("/createResetSession", createResetSession);
//forget password
router.put("/forgetpassword", resetPassword);

export default router;
