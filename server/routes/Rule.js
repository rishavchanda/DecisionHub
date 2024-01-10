import express from "express";
import { createRule, deleteRule, getRuleById, getRules, searchRule, updateRuleWithVersion } from "../controllers/Rules.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createRule);
router.get("/getAllRules", verifyToken, getRules);
router.get("/getOneRule/:id", verifyToken, getRuleById);
router.get('/searchRule', verifyToken, searchRule);
router.patch('/updateRuleVersion/:id', verifyToken, updateRuleWithVersion);
router.delete('/deleteRule/:id', verifyToken, deleteRule);

export default router;
