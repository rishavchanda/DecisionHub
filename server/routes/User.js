import express from "express";
import { findUserByEmail, getRecentActivity, getTablesList, getUserRules, updateProfile } from "../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/findUserByEmail", findUserByEmail);
router.get("/getRecentActivity", verifyToken, getRecentActivity);
router.get("/getUserRules", verifyToken, getUserRules);
router.patch("/", verifyToken, updateProfile);
router.get("/getTableList", verifyToken, getTablesList);

export default router;
