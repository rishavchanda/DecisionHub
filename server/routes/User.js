import express from "express";
import { findUserByEmail, getRecentActivity, getUserRules, updateProfile } from "../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/findUserByEmail", findUserByEmail);
router.get("/getRecentActivity", verifyToken ,getRecentActivity);
router.get("/getUserRules", verifyToken, getUserRules);
router.patch("/", verifyToken, updateProfile);

export default router;
