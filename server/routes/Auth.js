import express from "express";
import { SignIn, SignUp, generateOTP, verifyOTP } from "../controllers/Auth.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.get("/generate-otp", generateOTP);
router.get("/verify-otp", verifyOTP);

export default router;
