import express from "express";
import { findUserByEmail } from "../controllers/Users.js";

const router = express.Router();

router.post("/findUserByEmail", findUserByEmail);

export default router;
