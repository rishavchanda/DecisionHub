import express from "express";
import { createRule, getRules } from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createRule);
router.get("/", verifyToken, getRules);

export default router;
