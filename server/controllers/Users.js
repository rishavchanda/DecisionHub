// controllers/userController.js
import { addUser, allUsers, userTable } from "../models/User.js";

export const createUserTable = async (req, res, next) => {
  try {
    await userTable(req.db);
    res.status(200).json({ message: "User table created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await allUsers(req.db);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await addUser(req.db, req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
