import express from "express";
import {
  createRule,
  deleteRule,
  getRuleByIdAndVersion,
  getRules,
  searchRule,
  updateRule,
  updateRuleWithVersion,
} from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createRule);
router.get("/", verifyToken, getRules);
router.post("/:id", verifyToken, getRuleByIdAndVersion);
router.get("/searchRule", verifyToken, searchRule);
router.patch("/:id", verifyToken, updateRule);
router.patch("/updateRuleVersion/:id", verifyToken, updateRuleWithVersion);
router.delete("/:id", verifyToken, deleteRule);

export default router;
