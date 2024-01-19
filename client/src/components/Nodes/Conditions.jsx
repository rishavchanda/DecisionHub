import {
  AddRounded,
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  comparisonOperations,
  dateUnits,
  specialAttributes,
  specialFunctions,
  timeUnits,
} from "../../utils/data";
import { useReactFlow } from "reactflow";
import { Autocomplete, TextField } from "@mui/material";

const Wrapper = styled.div`
  width: fit-content;
`;

const Condition = styled.div`
  draggable: true;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.text_secondary + 10};
  ${({ result, color }) =>
    result &&
    `
  border: 0.5px solid ${color ? "#02ab4080" : "#FF007280"};
  background: ${color ? "#02ab4010" : "#FF007210"};
  `}
`;

const Move = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  font-size: 10px;
`;

const VR = styled.div`
  width: 0.5px;
  height: 100%;
  background: ${({ theme }) => theme.text_secondary + 50};
`;

const ConditionBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const OutlineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
  padding: 9px 8px;
  font-size: 10px;
  color: ${({ theme }) => theme.text_primary};
  &:focus {
    outline: none;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Select = styled.select`
  background: transparent;
  border: none;
  padding-right: 2px;
  font-size: 10px;
  color: ${({ theme }) => theme.text_primary};
  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  max-width: 60px;
  background: transparent;
  border: none;
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  &:focus {
    outline: none;
  }
`;

const Button = styled.div`
  width: max-content;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 10px;
  ${({ booleanDisabled }) =>
    booleanDisabled &&
    `
    cursor: not-allowed;
  `}
`;

const Hr = styled.div`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
`;

const Conditions = ({
  nodeId,
  conditionIndex,
  withBoolean,
  booleanDisabled,
  condition,
  inputAttribute,
  deleteCondition,
  addBooleanCondition,
  result,
  index,
}) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();
  const test = result ? result[index] : null;

  // update the expression
  const handleSelectChange = (part, field, expressionIndex, value) => {
    console.log(value);
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              const updatedExpression = {
                ...condition.expression,
                [part]: condition?.expression[part]?.map((expr, eIndex) => {
                  if (eIndex === expressionIndex) {
                    if (
                      field === "op1" &&
                      expr.op1 !== null &&
                      specialFunctions?.find((func) => func.value === value)
                    ) {
                      return {
                        ...expr,
                        op1: value + ",null,null,null",
                      };
                    } else if (
                      field === "op2" &&
                      expr.op2 !== null &&
                      specialFunctions?.find((func) => func.value === value)
                    ) {
                      return {
                        ...expr,
                        op2: value + ",null,null,null",
                      };
                    } else if (field === "op1" && expr.op1 !== null) {
                      return { ...expr, op1: value };
                    } else if (field === "operator") {
                      return { ...expr, operator: value };
                    } else if (field === "op2") {
                      console.log(value);
                      return { ...expr, op2: value };
                    }
                  }
                  return expr;
                }),
              };

              return {
                ...condition,
                expression: {
                  ...condition.expression,
                  [part]: updatedExpression[part],
                },
              };
            }
            return condition;
          }),
        };

        return { ...node, data: updatedData };
      }
      return node;
    });
    console.log(updatedNodes);
    reactFlow.setNodes(updatedNodes);
  };

  // handel chnage for comparator
  const handleComparatorChange = (value) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              return {
                ...condition,
                expression: {
                  ...condition.expression,
                  comparator: value,
                },
              };
            }
            return condition;
          }),
        };
        return { ...node, data: updatedData };
      }
      return node;
    });

    reactFlow.setNodes(updatedNodes);
  };

  const getInputAttribute = (value, pos) => {
    if (value?.split(",")[pos] !== null || undefined || "")
      return (value = value?.split(",")[pos]);
    else return "null";
  };

  // handel function input attribute change for selects
  const handleFunctionInputAttributeChange = (
    field,
    expressionIndex,
    value
  ) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              return {
                ...condition,
                expression: {
                  lhs: condition.expression.lhs.map((lhsItem, lhsIndex) => {
                    if (lhsIndex === expressionIndex) {
                      if (field === "fun" && lhsItem.op1 !== null) {
                        return {
                          ...lhsItem,
                          op1:
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val1") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val2") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val3") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            value,
                        };
                      }
                    }
                    return lhsItem;
                  }),
                  comparator: condition.expression.comparator,
                  rhs: condition.expression.rhs.map((lhsItem, lhsIndex) => {
                    if (lhsIndex === expressionIndex) {
                      if (field === "fun" && lhsItem.op1 !== null) {
                        return {
                          ...lhsItem,
                          op1:
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val1") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val2") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            value +
                            "," +
                            getInputAttribute(lhsItem.op1, 3),
                        };
                      } else if (field === "val3") {
                        return {
                          ...lhsItem,
                          op1:
                            getInputAttribute(lhsItem.op1, 0) +
                            "," +
                            getInputAttribute(lhsItem.op1, 1) +
                            "," +
                            getInputAttribute(lhsItem.op1, 2) +
                            "," +
                            value,
                        };
                      }
                    }
                    return lhsItem;
                  }),
                },
              };
            }
            return condition;
          }),
        };
        return { ...node, data: updatedData };
      }
      return node;
    });

    reactFlow.setNodes(updatedNodes);
  };

  // add a blank expression
  const addBlankExpression = (part) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              if (
                condition.expression[part].length === 1 &&
                condition.expression[part][0].operator == null &&
                condition.expression[part][0].op2 == null
              ) {
                // add operator and op2 to the first expression
                return {
                  ...condition,
                  expression: {
                    ...condition.expression,
                    [part]: [
                      {
                        ...condition.expression[part][0],
                        operator: "",
                        op2: "",
                      },
                    ],
                  },
                };
              }
              return {
                ...condition,
                expression: {
                  ...condition.expression,
                  [part]: [
                    ...condition.expression[part],
                    { op1: null, operator: "", op2: "" },
                  ],
                },
              };
            }
            return condition;
          }),
        };
        return { ...node, data: updatedData };
      }
      return node;
    });

    reactFlow.setNodes(updatedNodes);
  };

  // delete the expression
  const deleteExpression = (part, expressionIndex) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              if (condition.expression[part].length === 1) {
                return {
                  ...condition,
                  expression: {
                    ...condition.expression,
                    [part]: [
                      {
                        ...condition.expression[part][0],
                        operator: null,
                        op2: null,
                      },
                    ],
                  },
                };
              } else {
                return {
                  ...condition,
                  expression: {
                    ...condition.expression,
                    [part]: condition.expression[part].filter(
                      (lhsItem, lhsIndex) => lhsIndex !== expressionIndex
                    ),
                  },
                };
              }
            }
            return condition;
          }),
        };
        return { ...node, data: updatedData };
      }
      return node;
    });

    reactFlow.setNodes(updatedNodes);
  };

  //handel move up and down
  const moveCondition = (index, direction) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        // keep the boolean constant if it is present in the condition change the rest
        const boolean = node.data.conditions[index].boolean;
        const booleanDirection =
          node.data.conditions[index + direction].boolean;
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === index) {
              return {
                ...node.data.conditions[index + direction],
                boolean: boolean,
              };
            } else if (cIndex === index + direction) {
              return {
                ...node.data.conditions[index],
                boolean: booleanDirection,
              };
            }
            return condition;
          }),
        };
        return { ...node, data: updatedData };
      }
      return node;
    });

    reactFlow.setNodes(updatedNodes);
  };

  // generate the rule string
  function generateRuleString(expression) {
    let ruleString = "";
    let result = "";

    if (!Array.isArray(expression) || expression.length === 0) {
      return ruleString;
    }

    expression.forEach((expr, index) => {
      if (index > 0) {
        // Add logical operator (e.g., AND, OR) based on your requirements
        //   ruleString += " AND ";
      }

      if (expr.inputAttribute === null) {
        // If inputAttribute is null, use the result of the previous expression
        ruleString = `(${result} ${expr.operator} ${expr.value})`;
      } else {
        // If inputAttribute is not null, use the provided inputAttribute
        ruleString = `(${expr.inputAttribute} ${expr.operator} ${expr.value})`;
      }

      // Update the result for the next iteration
      result =
        expr.inputAttribute !== null
          ? `(${expr.inputAttribute} ${expr.operator} ${expr.value})`
          : `(${result} ${expr.operator} ${expr.value})`;
    });

    return ruleString;
  }

  const [attributesWithSpecial, setAttributesWithSpecial] = useState([
    ...inputAttribute,
    "current_date",
    "current_time",
  ]);
  const [attributesWithSpecialFunctions, setAttributesWithSpecialFunctions] =
    useState([
      ...inputAttribute,
      "date_diff",
      "time_diff",
      "current_date",
      "current_time",
    ]);
  let arithmeticOperations = ["+", "-", "*", "/", "%"];
  let comparators = [">", "<", "==", ">=", "<=", "!="];
  let dateUnit = ["days", "months", "years", "seconds", "minutes", "hours"];

  return (
    <Wrapper>
      <Condition result={result} color={test}>
        <div
          style={{
            display: "flex",
            gap: "6px",
            fontSize: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "4px",
            fontWeight: "600",
          }}
        >
          <Move>
            <ArrowDropUpRounded
              sx={{
                fontSize: "12px",
                color: theme.text_secondary,
                padding: "0.4px",
                borderRadius: "50%",
                backgroundColor: theme.text_secondary + 10,
                cursor:
                  conditionIndex === 0
                    ? "not-allowed !important"
                    : "pointer !important",
              }}
              onClick={() =>
                conditionIndex > 0 && moveCondition(conditionIndex, -1)
              }
            />
            <ArrowDropDownRounded
              sx={{
                fontSize: "12px",
                color: theme.text_secondary,
                padding: "0.4px",
                borderRadius: "50%",
                backgroundColor: theme.text_secondary + 10,
                cursor:
                  conditionIndex ===
                  reactFlow.getNode(nodeId)?.data.conditions.length - 1
                    ? "not-allowed !important"
                    : "pointer !important",
              }}
              onClick={() =>
                conditionIndex <
                  reactFlow.getNode(nodeId)?.data.conditions.length - 1 &&
                moveCondition(conditionIndex, 1)
              }
            />
          </Move>
          {conditionIndex + 1}
        </div>
        <VR />
        {condition.expression?.lhs?.map((item, index) => (
          <>
            <ConditionBody key={index}>
              {item?.op1 !== null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={getInputAttribute(item?.op1, 0)}
                    onChange={(e, v) =>
                      handleSelectChange("lhs", "op1", index, v)
                    }
                    options={attributesWithSpecialFunctions}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={getInputAttribute(item?.op1, 0)}
                        onChange={(e) =>
                          handleSelectChange(
                            "lhs",
                            "op1",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />

                  {(item?.op1 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op1, 0)
                    )) && (
                    <>
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        ) && (
                          <>
                            (
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 1)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 1)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val1",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 2)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 2)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val2",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 3)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  v
                                )
                              }
                              options={dateUnit}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 3)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val3",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            )
                          </>
                        )
                      }
                    </>
                  )}
                </OutlineWrapper>
              )}
              {item.operator != null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={item?.operator}
                    onChange={(e, v) =>
                      handleSelectChange("lhs", "operator", index, v)
                    }
                    options={arithmeticOperations}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={item?.operator}
                        onChange={(e) =>
                          handleSelectChange(
                            "lhs",
                            "operator",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />
                </OutlineWrapper>
              )}
              {item?.op2 !== null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={getInputAttribute(item?.op2, 0)}
                    onChange={(e, v) =>
                      handleSelectChange("lhs", "op2", index, v)
                    }
                    options={attributesWithSpecialFunctions}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={getInputAttribute(item?.op2, 0)}
                        onChange={(e) =>
                          handleSelectChange(
                            "lhs",
                            "op2",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />

                  {(item?.op2 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op2, 0)
                    )) && (
                    <>
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op2, 0)
                        ) && (
                          <>
                            (
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 1)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 1)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val1",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 2)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 2)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val2",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 3)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  v
                                )
                              }
                              options={dateUnit}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 3)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val3",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            )
                          </>
                        )
                      }
                    </>
                  )}
                </OutlineWrapper>
              )}
            </ConditionBody>
            {index > 0 && (
              <DeleteOutlineRounded
                key={index}
                sx={{
                  fontSize: "18px",
                  color: theme.text_secondary,
                  cursor: "pointer",
                }}
                onClick={() => deleteExpression("lhs", index)}
              />
            )}
          </>
        ))}

        {condition.expression?.lhs[0].op2 != null && (
          <DeleteOutlineRounded
            key={index}
            sx={{
              fontSize: "18px",
              color: theme.text_secondary,
              cursor: "pointer",
            }}
            onClick={() => deleteExpression("lhs", index)}
          />
        )}
        <Button onClick={() => addBlankExpression("lhs")}>
          <AddRounded sx={{ fontSize: "14px", color: theme.primary }} />
        </Button>

        {/* lhs */}
        <VR style={{ width: "2px" }} />
        <Autocomplete
          disablePortal
          fullWidth
          isOptionEqualToValue={(option, value) => option === value}
          value={condition?.expression?.comparator}
          onChange={(e, v) => handleComparatorChange(v)}
          options={comparators}
          fontSize="12px"
          sx={{
            width: "200px",
            color: theme.text_primary,
            border: "none",
            outline: "none",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              border: "none",
              padding: 0,
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "none",
              padding: 0,
            },
          }}
          renderInput={(params) => (
            <TextField
              sx={{
                width: "200px",
                color: theme.text_primary,
                input: {
                  color: theme.text_primary,
                  borderColor: `${theme.text_secondary} !important`,
                  fontSize: "12px",
                },
                borderColor: `${theme.text_secondary} !important`,
                borderRadius: "8px",
                padding: "0px",
                fontSize: "8px",
                ".MuiSvgIcon-root ": {
                  fill: `${theme.text_secondary} !important`,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  padding: 0,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  padding: 0,
                },
              }}
              fullWidth
              {...params}
              placeholder="Comparator"
              value={condition?.expression?.comparator}
              onChange={(e) => handleComparatorChange(e.target.value)}
            />
          )}
        />
        <VR style={{ width: "2px" }} />
        {/* rhs */}
        {condition.expression?.rhs?.map((item, index) => (
          <>
            <ConditionBody key={index}>
              {item?.op1 !== null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={getInputAttribute(item?.op1, 0)}
                    onChange={(e, v) =>
                      handleSelectChange("rhs", "op1", index, v)
                    }
                    options={attributesWithSpecialFunctions}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={getInputAttribute(item?.op1, 0)}
                        onChange={(e) =>
                          handleSelectChange(
                            "rhs",
                            "op1",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />

                  {(item?.op1 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op1, 0)
                    )) && (
                    <>
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        ) && (
                          <>
                            (
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 1)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 1)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val1",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 2)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 2)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val2",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op1, 3)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  v
                                )
                              }
                              options={dateUnit}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op1, 3)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val3",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            )
                          </>
                        )
                      }
                    </>
                  )}
                </OutlineWrapper>
              )}
              {item?.operator != null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={item?.operator}
                    onChange={(e, v) =>
                      handleSelectChange("rhs", "operator", index, v)
                    }
                    options={arithmeticOperations}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={item?.operator}
                        onChange={(e) =>
                          handleSelectChange(
                            "rhs",
                            "operator",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />
                </OutlineWrapper>
              )}
              {item?.op2 !== null && (
                <OutlineWrapper>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    isOptionEqualToValue={(option, value) => option === value}
                    value={getInputAttribute(item?.op2, 0)}
                    onChange={(e, v) =>
                      handleSelectChange("rhs", "op2", index, v)
                    }
                    options={attributesWithSpecialFunctions}
                    fontSize="12px"
                    sx={{
                      width: "200px",
                      color: theme.text_primary,
                      border: "none",
                      outline: "none",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        padding: 0,
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                          padding: 0,
                        },
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: "200px",
                          color: theme.text_primary,
                          input: {
                            color: theme.text_primary,
                            borderColor: `${theme.text_secondary} !important`,
                            fontSize: "12px",
                          },
                          borderColor: `${theme.text_secondary} !important`,
                          borderRadius: "8px",
                          padding: "0px",
                          fontSize: "8px",
                          ".MuiSvgIcon-root ": {
                            fill: `${theme.text_secondary} !important`,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            padding: 0,
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                              padding: 0,
                            },
                        }}
                        fullWidth
                        {...params}
                        placeholder="Select"
                        value={getInputAttribute(item?.op2, 0)}
                        onChange={(e) =>
                          handleSelectChange(
                            "rhs",
                            "op2",
                            index,
                            e.target.value
                          )
                        }
                      />
                    )}
                  />

                  {(item?.op2 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op2, 0)
                    )) && (
                    <>
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op2, 0)
                        ) && (
                          <>
                            (
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 1)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 1)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val1",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 2)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  v
                                )
                              }
                              options={attributesWithSpecial}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 2)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val2",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            ,
                            <Autocomplete
                              disablePortal
                              fullWidth
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              value={getInputAttribute(item?.op2, 3)}
                              onChange={(e, v) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  v
                                )
                              }
                              options={dateUnit}
                              fontSize="12px"
                              sx={{
                                width: "200px",
                                color: theme.text_primary,
                                border: "none",
                                outline: "none",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiOutlinedInput-root": {
                                  border: "none",
                                  padding: 0,
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                    padding: 0,
                                  },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    width: "200px",
                                    color: theme.text_primary,
                                    input: {
                                      color: theme.text_primary,
                                      borderColor: `${theme.text_secondary} !important`,
                                      fontSize: "12px",
                                    },
                                    borderColor: `${theme.text_secondary} !important`,
                                    borderRadius: "8px",
                                    padding: "0px",
                                    fontSize: "8px",
                                    ".MuiSvgIcon-root ": {
                                      fill: `${theme.text_secondary} !important`,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                      },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      padding: 0,
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        padding: 0,
                                      },
                                  }}
                                  fullWidth
                                  {...params}
                                  placeholder="Select"
                                  value={getInputAttribute(item?.op2, 3)}
                                  onChange={(e) =>
                                    handleFunctionInputAttributeChange(
                                      "val3",
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            />
                            )
                          </>
                        )
                      }
                    </>
                  )}
                </OutlineWrapper>
              )}
            </ConditionBody>
            {index > 0 && (
              <DeleteOutlineRounded
                key={index}
                sx={{
                  fontSize: "18px",
                  color: theme.text_secondary,
                  cursor: "pointer",
                }}
                onClick={() => deleteExpression("rhs", index)}
              />
            )}
          </>
        ))}

        {condition.expression?.rhs[0].op2 != null && (
          <DeleteOutlineRounded
            key={index}
            sx={{
              fontSize: "18px",
              color: theme.text_secondary,
              cursor: "pointer",
            }}
            onClick={() => deleteExpression("rhs", index)}
          />
        )}

        <Button onClick={() => addBlankExpression("rhs")}>
          <AddRounded sx={{ fontSize: "14px", color: theme.primary }} />
        </Button>
        <VR style={{ width: "1px" }} />
        <DeleteOutlineRounded
          sx={{
            fontSize: "18px",
            color: theme.text_secondary,
            cursor:
              reactFlow.getNode(nodeId)?.data?.conditions?.length === 1 &&
              conditionIndex === 0
                ? "not-allowed"
                : "pointer",
          }}
          onClick={() => {
            reactFlow.getNode(nodeId)?.data?.conditions?.length > 1 &&
              deleteCondition(conditionIndex);
          }}
        />
      </Condition>
      {!withBoolean && (
        <>
          <VR style={{ height: "14px", margin: "0px 20px", width: "2px" }} />
          <Button
            style={{
              width: "fit-content",
              fontSize: "10px",
              marginBottom: "2px",
            }}
            booleanDisabled={booleanDisabled}
            onClick={() =>
              !booleanDisabled && addBooleanCondition(conditionIndex)
            }
          >
            <AddRounded sx={{ fontSize: "14px", color: theme.primary }} />
            Add Boolean Condition
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default Conditions;
