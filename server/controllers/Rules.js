import db from "../models/index.js";
import { createError } from "../error.js";

const Rule = db.rule;
const User = db.user;

export const createRule = async (req, res, next) => {
  const { title, descryption, inputAttributes, outputAttributes, condition } =
    req.body;
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.create({
      title,
      descryption,
      inputAttributes,
      outputAttributes,
      condition,
    });
    await rule.setUser(user);
    return res.status(201).json(rule);
  } catch (error) {
    return next(error);
  }
};

export const getRules = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rules = await user.getRules();
    return res.status(200).json(rules);
  } catch (error) {
    return next(error);
  }
};
