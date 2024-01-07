import express from "express";
import { SignIn, SignUp, createResetSession, generateOTP, googleAuthSignIn, resetPassword, verifyOTP } from "../controllers/Users.js";
import { localVariables } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
//google signin
router.post("/google", googleAuthSignIn);
//generate otp
router.post("/generateotp",localVariables, generateOTP);
//verify opt
router.get("/verifyotp", verifyOTP);
//create reset session
router.get("/createResetSession", createResetSession);
//forget password
router.put("/forgetpassword", resetPassword);

export default router;
