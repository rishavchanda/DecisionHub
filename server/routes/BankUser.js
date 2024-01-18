import express from "express";
import { createBankUser, createLoan } from "../controllers/BankUser.js";

const router = express.Router();

router.post("/create", createBankUser);

router.post("/:id", createLoan);

export default router;
