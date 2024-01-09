import express from "express";
import {
  createRule,
  deleteRule,
  getRuleById,
  getRules,
  searchRule,
  updateRule,
} from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createRule);
router.get("/", verifyToken, getRules);
router.get("/:id", verifyToken, getRuleById);
router.get("/searchRule", verifyToken, searchRule);
router.patch("/:id", verifyToken, updateRule);
router.delete("/:id", verifyToken, deleteRule);

export default router;
