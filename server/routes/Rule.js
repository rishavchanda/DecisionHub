import express from "express";
import {
  createRule,
  createRuleWithText,
  deleteRule,
  getRuleByIdAndVersion,
  getRules,
  searchRule,
  testing,
  updateRule,
  updateRuleWithVersion,
} from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// router.post("/ruleWithText", createRuleWithText);
router.post("/", verifyToken, createRule);
router.get("/", verifyToken, getRules);
router.post("/testing/:id/:version", verifyToken, testing);
router.post("/:id", verifyToken, getRuleByIdAndVersion);
router.patch("/ruleWithText/:id", verifyToken, createRuleWithText);
router.get("/searchRule", verifyToken, searchRule);
router.patch("/:id", verifyToken, updateRule);
router.patch("/updateRuleVersion/:id", verifyToken, updateRuleWithVersion);
router.delete("/:id/:versionId", verifyToken, deleteRule);

export default router;
