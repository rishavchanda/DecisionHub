import express from "express";
import {
  createRule,
  createRuleWithText,
  deleteRule,
  getRuleByIdAndVersion,
  getRules,
  searchRule,
  testWithDb,
  testing,
  testingExcel,
  updateRule,
  updateRuleWithVersion,
} from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = express.Router();

router.patch("/ruleWithText/:id", verifyToken, createRuleWithText);
router.post("/", verifyToken, createRule);
router.get("/", verifyToken, getRules);
router.post("/testing/:id/:version", verifyToken, testing);
router.post("/testingWithData/:id", verifyToken, uploadMiddleware, testingExcel);
router.post("/testingWithDb/:id", verifyToken, testWithDb);
router.post("/:id", verifyToken, getRuleByIdAndVersion);
router.get("/searchRule", verifyToken, searchRule);
router.patch("/:id", verifyToken, updateRule);
router.patch("/updateRuleVersion/:id", verifyToken, updateRuleWithVersion);
router.delete("/:id/:versionId", verifyToken, deleteRule);

export default router;
