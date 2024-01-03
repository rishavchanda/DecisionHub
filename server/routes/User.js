import express from "express";
import { SignIn, SignUp } from "../controllers/Users.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);

export default router;
