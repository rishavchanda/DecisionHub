import express from "express";
import { findUserByEmail, getRecentActivity } from "../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/findUserByEmail", findUserByEmail);
router.get("/getRecentActivity", verifyToken ,getRecentActivity);

export default router;
