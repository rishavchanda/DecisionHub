import express from "express";
import {
  createUser,
  createUserTable,
  getAllUsers,
} from "../controllers/Users.js";

const router = express.Router();

router.post("/create-table", createUserTable);
router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
