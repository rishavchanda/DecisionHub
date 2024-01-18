import express from "express";
import { createBankUser } from "../controllers/BankUser.js";

const router = express.Router();

router.post("/", createBankUser);

export default router;
