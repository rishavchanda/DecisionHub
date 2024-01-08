import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

const User = db.user;

export const findUserByEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) return next(createError(404, "User does not exist"));
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
