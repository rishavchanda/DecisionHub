import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

const User = db.user;
import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

const User = db.user;

export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //check if user already exists
    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) return next(createError(409, "User already exists"));

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
    return next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) return next(createError(404, "User does not exist"));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return next(createError(401, "Invalid email or password"));

    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) return next(createError(404, "User does not exist"));
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return next(createError(401, "Invalid email or password"));

    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
    return next(error);
  }
};
