import db from "../models/index.js";
import { createError } from "../error.js";
import { Op } from "sequelize";

const Rule = db.rule;
const User = db.user;
const Version = db.version;

export const createRule = async (req, res, next) => {
  const { title, description, inputAttributes, outputAttributes, condition } =
    req.body;
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.create({
      title,
      description,
      inputAttributes,
      outputAttributes,
      condition,
    });
    await rule.setUser(user);
    await Version.create({
      title: rule.title,
      description: rule.description,
      inputAttributes: rule.inputAttributes,
      outputAttributes: rule.outputAttributes,
      condition: rule.condition,
      version: rule.version,
      ruleId: rule.id,
    });
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

export const getRuleById = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: ruleId } });
    if (!rule) {
      return next(createError(404, "No rule with this id"));
    }
    //check if user is owner of this rule
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(ruleId)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    // parse the json and return it
    const condition = JSON.parse(rule.condition);
    rule.condition = condition;
    return res.status(200).json(rule);
  } catch (error) {
    return next(error);
  }
};

export const searchRule = async (req, res) => {
  const query = req.query.title;
  try {
    const rules = await Rule.findAll({
      where: {
        title: {
          [Op.iLike]: `%${query}%`, // Case-insensitive search
        },
      },
      limit: 40,
    });
    res.status(200).json(rules);
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

export const updateRule = async (req, res, next) => {
  console.log(req.body);
  const userId = req.user.id;
  const ruleId = req.params.id;
  const newRule = req.body;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: ruleId } });
    if (!rule) {
      return next(createError(404, "No rule with that id"));
    }
    //check if user is owner of this rule
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(ruleId)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    await Rule.update(
      { ...newRule, version: rule.version + 1 },
      {
        where: {
          id: ruleId,
        },
      }
    );
    const updatedRule = await Rule.findOne({ where: { id: ruleId } });
    return res.status(200).json(updatedRule);
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const updateRuleWithVersion = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  const newRule = req.body;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: ruleId } });
    if (!rule) {
      return next(createError(404, "No rule with that id"));
    }
    //check if user is owner of this rule
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(ruleId)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    await Rule.update(
      { ...newRule, version: (rule.version + 0.1).toFixed(1) },
      {
        where: {
          id: ruleId,
        },
      }
    );
    const updatedRule = await Rule.findOne({ where: { id: ruleId } });
    await Version.create({
      title: updatedRule.title,
      description: updatedRule.description,
      inputAttributes: updatedRule.inputAttributes,
      outputAttributes: updatedRule.outputAttributes,
      condition: updatedRule.condition,
      version: updatedRule.version,
      ruleId: updatedRule.id,
    });
    return res.status(200).json(updatedRule);
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const deleteRule = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: ruleId } });
    if (!rule) {
      return next(createError(404, "No rule with that id"));
    }
    //check if user is owner of this rule
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(ruleId)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    await Rule.destroy({
      where: {
        id: ruleId,
      },
    });
    return res.status(200).json({ message: "Rule deleted succesfully" });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};
