import db from "../models/index.js";
import { createError } from "../error.js";
import { Op } from "sequelize";
import OpenAI from "openai";
import { createRuleRequest } from "../utils/prompt.js";
import * as dotenv from "dotenv";
import xlsx from "xlsx";
import path from "path";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const Rule = db.rule;
const User = db.user;
const Version = db.version;

export const createRule = async (req, res, next) => {
  const { title, description, inputAttributes, outputAttributes, condition } =
    req.body;
  const test = JSON.parse(req.body.condition);
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
    const version = await Version.create({
      title: rule.title,
      description: rule.description,
      inputAttributes: rule.inputAttributes,
      outputAttributes: rule.outputAttributes,
      condition: rule.condition,
      version: rule.version,
    });
    await version.setRule(rule);
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

export const getRuleByIdAndVersion = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const version = req.body.version;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: id } });
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(id)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    const versions = await rule.getVersions();
    let versionValues = [];
    await versions
      .sort((a, b) => a.version - b.version)
      .map((version) => {
        versionValues.push(version.version);
      });
    if (!version) {
      return res.status(200).json({ rule: rule, versions: versionValues });
    } else {
      const ruleVersion = await Version.findOne({
        where: {
          ruleId: id,
          version: version,
        },
      });
      if (!ruleVersion) {
        return res.status(404).json({ error: "Rule not found" });
      }
      return res
        .status(200)
        .json({ rule: ruleVersion, versions: versionValues });
    }
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const searchRule = async (req, res) => {
  const userId = req.user.id;
  const query = req.query.title;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRules = await user.getRules();

    const rules = await Rule.findAll({
      attributes: ["id", "title", "description"], // Select only the required attributes
      where: {
        id: {
          [Op.in]: userRules.map((rule) => rule.id),
        },
        title: {
          [Op.iLike]: `%${query}%`,
        },
      },
      limit: 40,
    });

    res.status(200).json(rules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateRule = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  const newRule = req.body;
  const version = req.body.version;
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
    if (version == rule.version) {
      await Rule.update(
        {
          title: newRule.title,
          description: newRule.description,
          inputAttributes: newRule.inputAttributes,
          outputAttributes: newRule.outputAttributes,
          condition: newRule.condition,
          version: newRule.version,
        },
        {
          where: {
            id: ruleId,
          },
        }
      );
      const updatedRule = await Rule.findOne({ where: { id: ruleId } });
      await Version.update(
        {
          title: newRule.title,
          description: newRule.description,
          inputAttributes: newRule.inputAttributes,
          outputAttributes: newRule.outputAttributes,
          condition: newRule.condition,
          version: newRule.version,
        },
        {
          where: {
            ruleId: ruleId,
            version: version,
          },
        }
      );

      const versions = await rule.getVersions();
      let versionValues = [];
      await versions.map((version) => {
        versionValues.push(version.version);
      });
      return res
        .status(200)
        .json({ rule: updatedRule, versions: versionValues });
    } else {
      const ruleVersion = await Version.findOne({
        where: {
          ruleId: ruleId,
          version: version,
        },
      });
      await Version.update(
        {
          title: newRule.title,
          description: newRule.description,
          inputAttributes: newRule.inputAttributes,
          outputAttributes: newRule.outputAttributes,
          condition: newRule.condition,
          version: newRule.version,
        },
        {
          where: {
            id: ruleVersion.id,
          },
        }
      );
      const updatedVersion = await Version.findOne({
        where: { id: ruleVersion.id },
      });
      const versions = await rule.getVersions();
      let versionValues = [];
      await versions.map((version) => {
        versionValues.push(version.version);
      });

      return res
        .status(200)
        .json({ rule: updatedVersion, versions: versionValues });
    }
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
    const version = await Version.create({
      title: updatedRule.title,
      description: updatedRule.description,
      inputAttributes: updatedRule.inputAttributes,
      outputAttributes: updatedRule.outputAttributes,
      condition: updatedRule.condition,
      version: updatedRule.version,
    });
    await version.setRule(updatedRule);
    const versions = await rule.getVersions();
    let versionValues = [];
    await versions
      .sort((a, b) => a.version - b.version)
      .map((version) => {
        versionValues.push(version.version);
      });
    return res.status(200).json({ rule: updatedRule, versions: versionValues });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const deleteRule = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  const version = req.params.versionId;
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
    await Version.destroy({
      where: {
        ruleId: ruleId,
        version: version,
      },
    });
    if (version == rule.version) {
      const ruleVersions = await rule.getVersions();
      if (ruleVersions.length == 0) {
        await Rule.destroy({
          where: {
            id: ruleId,
          },
        });
        return res.status(204).json({ message: "Rule deleted succesfully" });
      } else {
        let versionValues = [];
        await ruleVersions
          .sort((a, b) => a.version - b.version)
          .map((version) => {
            versionValues.push(version.version);
          });

        const latestVersion = ruleVersions[ruleVersions.length - 1];

        await Rule.update(
          {
            title: latestVersion.title,
            description: latestVersion.description,
            inputAttributes: latestVersion.inputAttributes,
            outputAttributes: latestVersion.outputAttributes,
            condition: latestVersion.condition,
            version: latestVersion.version,
          },
          {
            where: {
              id: ruleId,
            },
          }
        );
        const newLatestRule = await Rule.findOne({
          where: {
            id: ruleId,
          },
        });
        return res
          .status(200)
          .json({ rule: newLatestRule, versions: versionValues });
      }
    } else {
      const ruleVersions = await rule.getVersions();
      let versionValues = [];
      await ruleVersions
        .sort((a, b) => a.version - b.version)
        .map((version) => {
          versionValues.push(version.version);
        });
      return res.status(200).json({ rule: rule, versions: versionValues });
    }
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const testingExcel = async (req, res, next) => {
  const storagePath = "FILES_STORAGE/";
  const userId = req.user.id;
  const { id, version } = req.params;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const rule = await Rule.findOne({ where: { id: id } });
    if (!rule) {
      return next(createError(404, "No rule with that id"));
    }
    //check if user is owner of this rule
    const userRules = await user.getRules();
    const ruleIds = userRules.map((rule) => rule.id);
    if (!ruleIds.includes(id)) {
      return next(createError(403, "You are not owner of this rule"));
    }
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(storagePath, file.filename);
    let workbook = xlsx.readFile(filePath);
    let sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);

    sheet_name_list.forEach(function (y) {
      var worksheet = workbook.Sheets[y];
      // getting the complete sheet
      var headers = {};
      var data = [];
      for (let z in worksheet) {
        if (z[0] === "!") continue;
        // parse out the column, row, and value
        var col = z.substring(0, 1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;
        // store header names
        if (row == 1) {
          headers[col] = value;
          // storing the header names
          continue;
        }
        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
      }
      // drop those first two rows which are empty
      data.shift();
      data.shift();

      // Add "output" field with a value of 0 to each row
      data.forEach((row) => {
        row["output"] = 0;
      });

      var newWorkbook = xlsx.utils.book_new();
      var newWorksheet = xlsx.utils.json_to_sheet(data);

      // Add the worksheet to the new workbook
      xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet 1");

      // Specify the path for the output file in the FILES_STORAGE directory
      const outputFilePath = path.join(storagePath, "output.xlsx");

      // Write the new workbook to the specified path
      xlsx.writeFile(newWorkbook, outputFilePath);
    });
    await Rule.update(
      { ...rule, tested: true },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      success: true,
      message: "File processed and saved successfully",
    });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const createRuleWithText = async (req, res, next) => {
  const userId = req.user.id;
  const ruleId = req.params.id;
  const { version, conditions } = req.body;
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
    const parsedRule = {
      title: rule.dataValues.title,
      description: rule.dataValues.description,
      inputAttributes: rule.dataValues.inputAttributes,
      outputAttributes: rule.dataValues.outputAttributes,
      condition: JSON.parse(rule.dataValues.condition),
    };
    const prompt = createRuleRequest(conditions, JSON.stringify(parsedRule));
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const newCondition = JSON.parse(
      completion.choices[0].message.content
    ).condition;

    if (rule.version === version) {
      await Rule.update(
        {
          title: rule.title,
          description: rule.description,
          inputAttributes: rule.inputAttributes,
          outputAttributes: rule.outputAttributes,
          version: rule.version,
          condition: JSON.stringify(newCondition),
        },
        {
          where: {
            id: ruleId,
          },
        }
      );

      const updatedRule = await Rule.findOne({ where: { id: ruleId } });

      await Version.update(
        {
          title: updateRule.title,
          description: updateRule.description,
          inputAttributes: updateRule.inputAttributes,
          outputAttributes: updateRule.outputAttributes,
          version: updateRule.version,
          condition: updateRule.condition,
        },
        {
          where: {
            ruleId: ruleId,
            version: version,
          },
        }
      );

      const versions = await rule.getVersions();
      let versionValues = [];
      await versions.map((version) => {
        versionValues.push(version.version);
      });
      return res
        .status(200)
        .json({ rule: updatedRule, versions: versionValues });
    } else {
      const ruleVersion = await Version.findOne({
        where: {
          ruleId: ruleId,
          version: version,
        },
      });
      await Version.update(
        {
          title: ruleVersion.title,
          description: ruleVersion.description,
          inputAttributes: ruleVersion.inputAttributes,
          outputAttributes: ruleVersion.outputAttributes,
          version: ruleVersion.version,
          condition: JSON.stringify(newCondition),
        },
        {
          where: {
            id: ruleVersion.id,
          },
        }
      );
      const updatedVersion = await Version.findOne({
        where: { id: ruleVersion.id },
      });
      const versions = await rule.getVersions();
      let versionValues = [];
      await versions.map((version) => {
        versionValues.push(version.version);
      });

      return res
        .status(200)
        .json({ rule: updatedVersion, versions: versionValues });
    }
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

const specialFunctions = ["date_diff", "time_diff"];
const specialArrtibutes = ["current_date", "current_time"];

const setEdgeColor = (condition, node, traversalNodes, color, result) => {
  const targetEdges = condition.edges.filter(
    (edge) =>
      edge.source === node.id &&
      edge.sourceHandle &&
      edge.sourceHandle === result
  );

  targetEdges.forEach((edge, index) => {
    const targetNode = condition.nodes.find((n) => n.id === edge.target);
    if (targetNode) {
      traversalNodes.push(targetNode);
    }

    condition.edges = condition.edges.map((e) =>
      e.id === targetEdges[index].id
        ? {
            ...e,
            animated: true,
            markerEnd: {
              type: "arrowclosed",
              width: 12,
              height: 12,
              color: color,
            },
            style: {
              strokeWidth: 5,
              stroke: color,
            },
          }
        : e
    );
  });

  return condition;
};

const setNodeColor = (
  condition,
  node,
  traversalNodes,
  color,
  computed,
  result
) => {
  const targetNode = condition.nodes.find((n) => n.id === node.id);

  traversalNodes.forEach((n) => {
    if (n.id === targetNode.id) {
      n.data.computed = computed;
      n.data.color = color;
      n.data.result = result;
    }
  });

  condition.nodes = condition.nodes.map((n) =>
    n.id === targetNode.id
      ? {
          ...n,
          data: {
            ...n.data,
            computed: computed,
            color: color,
            result: result,
          },
        }
      : n
  );

  return condition;
};

const evaluateNodes = async (
  node,
  condition,
  rule,
  traversalNodes,
  inputAttributes,
  testedRule
) => {
  const result = evaluateConditions(
    node.data.conditions,
    node.data.rule,
    inputAttributes
  );

  if (result[0]) {
    let updatedCondition = setEdgeColor(
      condition,
      node,
      traversalNodes,
      "#02ab40",
      "yes"
    );
    updatedCondition = setNodeColor(
      updatedCondition,
      node,
      traversalNodes,
      "#02ab40",
      "yes",
      result[1]
    );
    condition = updatedCondition;
    testedRule.condition = JSON.stringify(updatedCondition);
  } else {
    let updatedCondition = setEdgeColor(
      condition,
      node,
      traversalNodes,
      "#02ab40",
      "no"
    );
    updatedCondition = setNodeColor(
      updatedCondition,
      node,
      traversalNodes,
      "#02ab40",
      "no",
      result[1]
    );
    condition = updatedCondition;
    testedRule.condition = JSON.stringify(updatedCondition);
  }

  let nextNode;

  if (traversalNodes.length === 1) {
    if (traversalNodes[0].type === "outputNode") {
      // change and add the color of output node
      let updatedCondition = setNodeColor(
        condition,
        traversalNodes[0],
        traversalNodes,
        "#02ab40",
        [true]
      );
      condition = updatedCondition;
      testedRule.condition = JSON.stringify(updatedCondition);

      return testedRule;
    }
    nextNode = traversalNodes[0];
    // set the traversalNodes to empty array
    traversalNodes = [];
  } else if (traversalNodes.length > 1) {
    let nestedResult;
    for (let i = 0; i < traversalNodes.length; i++) {
      nestedResult = evaluateConditions(
        traversalNodes[i].data.conditions,
        traversalNodes[i].data.rule,
        inputAttributes
      );
      if (nestedResult[0] === true) {
        nextNode = traversalNodes[i];
      } else {
        let updatedCondition = setNodeColor(
          condition,
          traversalNodes[i],
          traversalNodes,
          "#FF0072",
          "null",
          nestedResult[1]
        );
        condition = updatedCondition;
        // sethe edge color to red which target is this node and source is the previous node
        const targetEdges = condition.edges.filter(
          (edge) => edge.target === traversalNodes[i].id
        );

        targetEdges.forEach((edge, index) => {
          condition.edges = condition.edges.map((e) =>
            e.id === targetEdges[index].id
              ? {
                  ...e,
                  animated: true,
                  markerEnd: {
                    type: "arrowclosed",
                    width: 12,
                    height: 12,
                    color: "#FF0072",
                  },
                  style: {
                    strokeWidth: 5,
                    stroke: "#FF0072",
                  },
                }
              : e
          );
        });
        testedRule.condition = JSON.stringify(updatedCondition);
      }
    }

    traversalNodes = [];
  }

  if (!nextNode) {
    return testedRule;
  }

  if (nextNode.type === "outputNode") {
    let updatedCondition = setNodeColor(
      condition,
      traversalNodes[0],
      traversalNodes,
      "#02ab40",
      [true]
    );
    condition = updatedCondition;
    testedRule.condition = JSON.stringify(updatedCondition);
    return testedRule;
  } else {
    return evaluateNodes(
      nextNode,
      condition,
      rule,
      traversalNodes,
      inputAttributes,
      testedRule
    );
  }
  return testedRule;
};

export const testing = async (req, res, next) => {
  const inputAttributes = req.body;
  const { id, version } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    let rule = await Rule.findOne({ where: { id: id } });
    if (!rule) {
      return next(createError(404, "No rule with that id"));
    }

    const userRules = await user.getRules();
    const ruleIds = userRules.map((r) => r.id);
    if (!ruleIds.includes(id)) {
      return next(createError(403, "You are not owner of this rule"));
    }

    const testRule = await Version.findOne({
      where: {
        ruleId: id,
        version: version,
      },
    });

    if (!testRule) {
      return next(createError(404, "Version not found"));
    }

    const versions = await rule.getVersions();
    let versionValues = [];

    versions
      .sort((a, b) => a.version - b.version)
      .forEach((v) => {
        versionValues.push(v.version);
      });

    const condition = JSON.parse(testRule.condition);
    let testedRule;
    const attributeNode = condition.nodes.find(
      (node) => node.type === "attributeNode"
    );

    const firstConditionalNodeId = condition.edges.find(
      (edge) => edge.source === "1"
    ).target;

    if (firstConditionalNodeId) {
      const firstConditionalNode = condition.nodes.find(
        (node) => node.id === firstConditionalNodeId
      );

      if (firstConditionalNode) {
        // sets the attribute Node color
        condition.nodes.forEach((node, index) => {
          if (node.type === "attributeNode") {
            condition.nodes[index] = {
              ...node,
              data: {
                ...node.data,
                computed: "yes",
                color: "#02ab40",
                result: true,
              },
            };
          }
        });

        condition.edges.forEach((edge, index) => {
          if (
            edge.source === attributeNode.id &&
            edge.target === firstConditionalNode.id
          ) {
            condition.edges[index] = {
              ...edge,
              animated: true,
              markerEnd: {
                type: "arrowclosed",
                width: 12,
                height: 12,
                color: "#02ab40",
              },
              style: {
                strokeWidth: 5,
                stroke: "#02ab40",
              },
            };
          }
        });
        let traversalNodes = [];
        testedRule = await evaluateNodes(
          firstConditionalNode,
          condition,
          rule,
          traversalNodes,
          inputAttributes,
          { condition: JSON.stringify(condition) }
        );

        rule.condition = testedRule.condition;
      }
    }
    await Rule.update(
      { ...rule, tested: true },
      {
        where: {
          id: id,
        },
      }
    );
    return res.json({
      rule: rule,
      versions: versionValues,
    });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};
function evaluateExpression(expression, inputData) {
  const { lhs, comparator, rhs } = expression;

  const evaluateSide = (side, inputData) => {
    const sideResults = []; // Array to store results of each operand
    const getComparisonValue = (attribute, inputData) => {
      const attributeValue =
        inputData[attribute] !== undefined
          ? String(inputData[attribute]).toLowerCase()
          : String(attribute).toLowerCase();

      return attributeValue;
    };
    side.forEach((operand) => {
      let sideValue = 0;

      if (operand.op1 === null) {
        // Use the result of the previous evaluation
        if (sideResults.length > 0) {
          sideValue = sideResults[sideResults.length - 1];
        } else {
          // Handle if no previous result is available
          sideValue = 0;
        }
      } else if (checkSpecialFunction(operand.op1.split(",")[0])) {
        sideValue = evaluateSpecialFunction(operand.op1, inputData);
      } else {
        sideValue = getComparisonValue(operand.op1, inputData);
      }

      switch (operand.operator) {
        case "/":
          sideValue /= parseFloat(operand.op2);
          break;
        case "*":
          sideValue *= parseFloat(operand.op2);
          break;
        case "+":
          sideValue += parseFloat(operand.op2);
          break;
        case "-":
          sideValue -= parseFloat(operand.op2);
          break;
        default:
          sideValue = parseFloat(sideValue);
          break;
      }

      // Store the result of the current operand in the array
      sideResults.push(sideValue);
    });

    // Return the final result of the last operand
    return sideResults.length > 0 ? sideResults[sideResults.length - 1] : 0;
  };
  const leftSideValue = evaluateSide(lhs, inputData);
  console.log(leftSideValue);
  const rightSideValue = evaluateSide(rhs, inputData);
  console.log(rightSideValue);

  switch (comparator) {
    case ">":
      return leftSideValue > rightSideValue;
    case "<":
      return leftSideValue < rightSideValue;
    case "==":
      return leftSideValue == rightSideValue;
    case "!=":
      return leftSideValue !== rightSideValue;
    case ">=":
      return leftSideValue >= rightSideValue;
    case "<=":
      return leftSideValue <= rightSideValue;
    default:
      return false;
  }
}

function checkSpecialFunction(func) {
  return specialFunctions.includes(func);
}

function evaluateSpecialFunction(inputAttribute, inputData) {
  const [specialFunction, attribute1, attribute2, unit] =
    inputAttribute.split(",");

  const getDateAttributeValue = (attribute) => {
    return attribute.toLowerCase() === "current_date"
      ? new Date()
      : new Date(inputData[attribute]);
  };

  const getDateTimeAttributeValue = (attribute) => {
    return attribute.toLowerCase() === "current_time"
      ? new Date()
      : new Date(inputData[attribute]);
  };

  const date1 = getDateAttributeValue(attribute1);
  const date2 = getDateAttributeValue(attribute2);

  const time1 = getDateTimeAttributeValue(attribute1);
  const time2 = getDateTimeAttributeValue(attribute2);

  const calculateDateDifference = (date1, date2, unit) => {
    const diffInMilliseconds = Math.abs(date1 - date2);

    switch (unit) {
      case "years":
        return Math.floor(diffInMilliseconds / (365 * 24 * 60 * 60 * 1000));

      case "months":
        return Math.floor(diffInMilliseconds / (30 * 24 * 60 * 60 * 1000));

      case "days":
        return Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000));

      default:
        return null; // Handle unknown units
    }
  };

  const calculateTimeDifference = (time1, time2, unit) => {
    const diffInSeconds = Math.abs(time1 - time2) / 1000;

    switch (unit) {
      case "seconds":
        return Math.floor(diffInSeconds);

      case "minutes":
        return Math.floor(diffInSeconds / 60);

      case "hours":
        return Math.floor(diffInSeconds / (60 * 60));

      default:
        return null; // Handle unknown units
    }
  };

  switch (specialFunction) {
    case "date_diff":
      return calculateDateDifference(date1, date2, unit);

    case "time_diff":
      return calculateTimeDifference(time1, time2, unit);

    default:
      return 0; // Handle unknown special functions
  }
}

function evaluateCondition(condition, inputData) {
  const { expression, boolean } = condition;
  // Evaluate the first expression
  let result = [];
  result.push(evaluateExpression(expression, inputData));
  return result[result.length - 1];
}

function evaluateConditions(conditions, rule, inputAttributes) {
  let result = [];
  const eachConditionResult = [];
  let logicalOperator = null;

  for (const condition of conditions) {
    const conditionResult = evaluateCondition(condition, inputAttributes);
    eachConditionResult.push(conditionResult);

    if (logicalOperator) {
      // If a logical operator is present, combine the previous result with the current result
      result[result.length - 1] = performLogicalOperation(
        result[result.length - 1],
        logicalOperator,
        conditionResult
      );
      logicalOperator = null;
    } else {
      // If no logical operator, simply push the current result
      result.push(conditionResult);
    }

    if (condition.boolean != null || condition.boolean != undefined) {
      // If a logical operator is found, store it for the next iteration
      logicalOperator = condition.boolean;
    }
  }

  if (rule === "Any") {
    return [result.includes(true), eachConditionResult];
  } else if (rule === "All") {
    return [result.every(Boolean), eachConditionResult];
  }

  return [result[0], eachConditionResult];
}
// Helper function to perform logical operations
function performLogicalOperation(operand1, operator, operand2) {
  switch (operator) {
    case "&&":
      return operand1 && operand2;
    case "||":
      return operand1 || operand2;
    default:
      return false;
  }
}
