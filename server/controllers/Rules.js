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
      return next(createError(404, "User not found"));
    }
    const userRules = await user.getRules();
    const rules = await Rule.findAll({
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
    console.log(err);
    res.json({ message: err.message });
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
        console.log({
          title: latestVersion.title,
          description: latestVersion.description,
          inputAttributes: latestVersion.inputAttributes,
          outputAttributes: latestVersion.outputAttributes,
          condition: latestVersion.condition,
          version: latestVersion.version,
        });

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

/*"condition": {
        "nodes": [
            {
                "width": 406,
                "height": 188,
                "id": "9",
                "type": "outputNode",
                "data": {
                    "label": "Set Interest rate",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "outputFields": [
                        {
                            "field": "",
                            "value": "9"
                        }
                    ]
                },
                "position": {
                    "x": -1215.6890993257136,
                    "y": 2251.2520005223014
                },
                "selected": false,
                "positionAbsolute": {
                    "x": -1215.6890993257136,
                    "y": 2251.2520005223014
                },
                "dragging": false
            },
            {
                "width": 406,
                "height": 188,
                "id": "8",
                "type": "outputNode",
                "data": {
                    "label": "Set Interest rate",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "outputFields": [
                        {
                            "field": "",
                            "value": "8"
                        }
                    ]
                },
                "position": {
                    "x": 1376.1750501662927,
                    "y": 2207.60460483563
                },
                "selected": false,
                "positionAbsolute": {
                    "x": 1376.1750501662927,
                    "y": 2207.60460483563
                },
                "dragging": false
            },
            {
                "width": 406,
                "height": 188,
                "id": "7",
                "type": "outputNode",
                "data": {
                    "label": "Set interest rate",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "outputFields": [
                        {
                            "field": "",
                            "value": "11"
                        }
                    ]
                },
                "position": {
                    "x": 17.510900674286233,
                    "y": 2239.2520005223014
                },
                "selected": false,
                "positionAbsolute": {
                    "x": 17.510900674286233,
                    "y": 2239.2520005223014
                },
                "dragging": false
            },
            {
                "width": 1069,
                "height": 382,
                "id": "6",
                "type": "conditionalNode",
                "data": {
                    "label": "Loan duration less than 5",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "rule": "Any",
                    "conditions": [
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "loan_duration",
                                    "operator": "<",
                                    "value": "5"
                                }
                            ]
                        }
                    ]
                },
                "position": {
                    "x": -100.82243265904708,
                    "y": 1660.2520005223014
                },
                "selected": false,
                "dragging": false,
                "positionAbsolute": {
                    "x": -100.82243265904708,
                    "y": 1660.2520005223014
                }
            },
            {
                "width": 1069,
                "height": 382,
                "id": "5",
                "type": "conditionalNode",
                "data": {
                    "label": "Loan Duration More than 10",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "rule": "Any",
                    "conditions": [
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "loan_duration",
                                    "operator": ">",
                                    "value": "10"
                                }
                            ]
                        }
                    ]
                },
                "position": {
                    "x": -1378.022432659047,
                    "y": 1596.2520005223014
                },
                "selected": false,
                "dragging": false,
                "positionAbsolute": {
                    "x": -1378.022432659047,
                    "y": 1596.2520005223014
                }
            },
            {
                "width": 1069,
                "height": 382,
                "id": "4",
                "type": "conditionalNode",
                "data": {
                    "label": "Loan duration equal to 8 ",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "rule": "Any",
                    "conditions": [
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "loan_duration",
                                    "operator": "==",
                                    "value": "8"
                                }
                            ]
                        }
                    ]
                },
                "position": {
                    "x": 1067.8417168329595,
                    "y": 1568.6046048356304
                },
                "selected": false,
                "dragging": false,
                "positionAbsolute": {
                    "x": 1067.8417168329595,
                    "y": 1568.6046048356304
                }
            },
            {
                "width": 1069,
                "height": 382,
                "id": "3",
                "type": "conditionalNode",
                "data": {
                    "label": "Credit Score Greater than 750",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "rule": "All",
                    "conditions": [
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "credit_score",
                                    "operator": ">",
                                    "value": "750"
                                }
                            ]
                        }
                    ]
                },
                "position": {
                    "x": 89.64423400761984,
                    "y": 1014.2520005223013
                },
                "selected": true,
                "positionAbsolute": {
                    "x": 89.64423400761984,
                    "y": 1014.2520005223013
                },
                "dragging": false
            },
            {
                "width": 1528,
                "height": 484,
                "id": "2",
                "type": "conditionalNode",
                "data": {
                    "label": "Not Under Age and has High Income",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ],
                    "rule": "All",
                    "conditions": [
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "date_diff,current_date,date_of_birth",
                                    "operator": ">",
                                    "value": "18"
                                }
                            ],
                            "boolean": "&&"
                        },
                        {
                            "multiple": false,
                            "expression": [
                                {
                                    "inputAttribute": "annual_income",
                                    "operator": "/",
                                    "value": "12"
                                },
                                {
                                    "inputAttribute": null,
                                    "operator": ">",
                                    "value": "1000000"
                                }
                            ]
                        }
                    ]
                },
                "position": {
                    "x": -142.36048076879842,
                    "y": 438.4262862586197
                },
                "selected": false,
                "positionAbsolute": {
                    "x": -142.36048076879842,
                    "y": 438.4262862586197
                },
                "dragging": false
            },
            {
                "width": 500,
                "height": 276,
                "id": "1",
                "type": "attributeNode",
                "data": {
                    "label": "Loan Interest Rate",
                    "description": "Set loan interest rate according to user data",
                    "inputAttributes": [
                        "account_no",
                        "loan_duration",
                        "date_of_birth",
                        "employment_status",
                        "annual_income",
                        "credit_score"
                    ],
                    "outputAttributes": [
                        "interest_rate"
                    ]
                },
                "position": {
                    "x": 260,
                    "y": 50
                },
                "selected": false,
                "dragging": false,
                "positionAbsolute": {
                    "x": 260,
                    "y": 50
                }
            }
        ],
        "edges": [
            {
                "id": "5-yes-9",
                "source": "5",
                "target": "9",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                    color: '#FF0072',
                }
    style: {
      strokeWidth: 2,
      stroke: '#FF0072',
    },
            },
            {
                "id": "4-yes-8",
                "source": "4",
                "target": "8",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "6-yes-7",
                "source": "6",
                "target": "7",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 2
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "3-yes-6",
                "source": "3",
                "target": "6",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 3
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "3-yes-5",
                "source": "3",
                "target": "5",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 3
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "3-yes-4",
                "source": "3",
                "target": "4",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 3
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "2-yes-3",
                "source": "2",
                "target": "3",
                "animated": false,
                "sourceHandle": "yes",
                "style": {
                    "strokeWidth": 3
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            },
            {
                "id": "1-start-2",
                "source": "1",
                "target": "2",
                "animated": false,
                "style": {
                    "strokeWidth": 3
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "width": 12,
                    "height": 12
                }
            }
        ]
    }
    */
/*
const inputData = {
  account_no: 4543566,
  loan_duration: 345654,
  date_of_birth: 19/11/2003,
  employment_status: "employed",
  annual_income: 1200000,
  credit_score: 800
};
*/
const specialFunctions = ["date_diff", "time_diff"];
const specialArrtibutes = ["current_date", "current_time"];

const setEdgeColor = (condition, node, traversalNodes, color, result) => {
  condition.edges.filter(
    (edge) => edge.source === node.id && edge.sourceHandle === result
  )
    .map((edge, index) => {
      const targetNode = condition.nodes.find(node => node.id === edge.target);
      if (targetNode) {
        traversalNodes.push(targetNode);
      }
      // Rule ta ke update korte hobe json parse kore tai error asche
      // condition.edges[index] = {
      //   ...edge,
      //   animated: true,
      //   markerEnd: {
      //     type: "arrowclosed",
      //     width: 12,
      //     height: 12,
      //     color: color,
      //   },
      //   style: {
      //     strokeWidth: 2,
      //     stroke: color,
      //   },
      // };
    });
};
const evaluateNodes = async (node, condition, rule, traversalNodes, inputAttributes) => {
  //evaluate condition function
  const result = evaluateConditions(
    node.data.conditions,
    node.data.rule,
    inputAttributes
  );
  // console.log(result, node.data.label)
  if (result[0]) {
    setEdgeColor(condition, node, traversalNodes, "green", "yes");
  } else {
    setEdgeColor(condition, node, traversalNodes, "green", "no");
  }
  if (traversalNodes.length === 0) {
    node = { ...node, error: true };
    return;
  }

  let nextNode;
  if (traversalNodes.length > 0) {
    //check if else if
    //set nextNode as node with yes output remove rest
    let nestedResult;
    for (let i = 0; i < traversalNodes.length; i++) {
      if (traversalNodes[i].type === "outputNode") {
        console.log(traversalNodes[i]);
        return rule;
      }
      else {
        nestedResult = evaluateConditions(
          traversalNodes[i].data.conditions,
          traversalNodes[i].data.rule,
          inputAttributes
        );
      }
      if (nestedResult) nextNode = traversalNodes[0];
      else {
        condition.edges.forEach((edge, index) => {
          if (edge.source === node && edge.sourceHandle === "no") {
            condition.edges[index] = {
              ...edge,
              animated: true,
              markerEnd: {
                type: "arrowclosed",
                width: 12,
                height: 12,
                color: "red",
              },
              style: {
                strokeWidth: 2,
                stroke: "#FF0072",
              },
            };
          }
        });
      }
    }
    traversalNodes = [];
  } else {
    nextNode = condition.nodes.find(
      (node) => node.id == traversalNodes[0]
    );
    traversalNodes.shift();
  }
  console.log(nextNode)
  if (nextNode.type === "outputNode") {
    return rule;
  }
  else {
    evaluateNodes(nextNode, condition, rule, traversalNodes, inputAttributes);
  }
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
    const testRule = await Version.findOne({
      where: {
        ruleId: id,
        version: version,
      },
    });
    if (!testRule) {
      return next(createError(404, "Version not found"));
    }
    const condition = JSON.parse(testRule.condition);
    let testedRule;
    const firstConditionalNodeId = condition.edges.find(edge => edge.source === "1").target;
    if (firstConditionalNodeId) {
      const firstConditionalNode = condition.nodes.find(node => node.id === firstConditionalNodeId);
      let traversalNodes = [];
      testedRule = await evaluateNodes(
        firstConditionalNode,
        condition,
        rule,
        traversalNodes,
        inputAttributes
      );
    }
    return res.json(testedRule);
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

function evaluateExpression(result, expression, inputData) {
  let { inputAttribute, operator, value } = expression;
  const inputValue = inputData[value]
    ? parseInt(inputData[value])
    : parseInt(value);

  const getComparisonValue = (attribute) =>
    attribute === null ? result : inputData[attribute];

  const performComparison = (attribute) => {
    let attributeValue = 0;
    if (checkSpecialFunction(attribute?.split(",")[0])) {
      attributeValue = evaluateSpecialFunction(attribute, inputData);
    } else {
      attributeValue = getComparisonValue(attribute);
    }
    switch (operator) {
      case ">":
        return attributeValue > inputValue;
      case "<":
        return attributeValue < inputValue;
      case "==":
        return attributeValue === inputValue;
      case "!=":
        return attributeValue !== inputValue;
      case ">=":
        return attributeValue >= inputValue;
      case "<=":
        return attributeValue <= inputValue;
      case "/":
        return attributeValue / inputValue;
      case "*":
        return attributeValue * inputValue;
      case "+":
        return attributeValue + inputValue;
      case "-":
        return attributeValue - inputValue;
      case "%":
        return attributeValue % inputValue;
      default:
        return false;
    }
  };

  return performComparison(inputAttribute);
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
  result.push(evaluateExpression(null, expression[0], inputData));
  // If there are more expressions, combine the results using boolean logic
  for (let i = 1; i < expression.length; i++) {
    result.push(evaluateExpression(result[i - 1], expression[i], inputData));
  }
  return result[result.length - 1];
}
function evaluateConditions(conditions, rule, inputAttributes) {
  let result = [];
  let logicalOperator = null;

  for (const condition of conditions) {
    const conditionResult = evaluateCondition(condition, inputAttributes);
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
    if (result.includes(true)) return true;
  } else if (rule === "All") {
    if (result.includes(false)) return false;
  }
  console.log(result);

  return result;
}

// Helper function to perform logical operations
function performLogicalOperation(operand1, operator, operand2) {
  switch (operator) {
    case "&&":
      return operand1 && operand2;
    case "||":
      return operand1 || operand2;
    default:
      return false; // Default to false if an invalid operator is provided
  }
}

// Example usage with your provided data
const rule = "Any";
const conditions = [
  {
    multiple: false,
    expression: [
      {
        inputAttribute: "date_diff,current_date,date_of_birth,years",
        operator: ">",
        value: "18",
      },
    ],
    boolean: "&&",
  },
  {
    multiple: false,
    expression: [
      {
        inputAttribute: "annual_income",
        operator: "/",
        value: "12",
      },
      {
        inputAttribute: null,
        operator: ">=",
        value: "100000",
      },
    ],
  },
  {
    multiple: false,
    expression: [
      {
        inputAttribute: "annual_income",
        operator: "/",
        value: "12",
      },
      {
        inputAttribute: null,
        operator: ">=",
        value: "100000",
      },
    ],
  },
];

const inputData = {
  account_no: "4543566",
  loan_duration: "12",
  date_of_birth: "2003/11/19",
  employment_status: "employed",
  annual_income: "1200000",
  credit_score: "800",
};

console.log(evaluateConditions(conditions, rule, inputData));
