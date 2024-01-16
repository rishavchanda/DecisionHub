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

export const getRecentActivity = async (req, res, next) => {
  // get the rules modified and get max 10 rules
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rules = await user.getRules({
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });
    return res.status(200).json(rules);
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const getUserRules = async (req, res, next) => {
  const userId = req.user.id;
  const filter = req.query.f;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (filter == "createdAt") {
      const rules = await user.getRules({
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
      return res.status(200).json(rules);
    } else {
      const rules = await user.getRules({
        order: [["updatedAt", "DESC"]],
        limit: 10,
      })
      return res.status(200).json(rules);
    }
  } catch (error) {
    return next(createError(error.status, error.message));
  }
}

export const updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if(!user.googleAuth){
      await User.update(
        { ...user, name: name, email: email, password: password },
        {
          where: {
            id: userId,
          },
        }
      );
      const updatedUser = await User.findOne({ where: { id: userId } });
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    return next(createError(error.status, error.message));
  }

} 