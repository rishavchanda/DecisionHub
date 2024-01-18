import {
  AddRounded,
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import React from "react";
import styled, { useTheme } from "styled-components";
import {
  arithmeticOperations,
  comparisonOperations,
  dateUnits,
  specialAttributes,
  specialFunctions,
  timeUnits,
} from "../../utils/data";
import { useReactFlow } from "reactflow";

const Wrapper = styled.div`
  width: fit-content;
`;

const Condition = styled.div`
  draggable: true;
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  ${({ result, color }) =>
    result &&
    `
  border: 1px solid ${color ? "#02ab40" : "#FF0072"};
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
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
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
  background: ${({ theme }) => theme.card};
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
  background: ${({ theme }) => theme.card};
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
  const handleSelectChange = (part, field, expressionIndex, event) => {
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
                      specialFunctions?.find(
                        (func) => func.value === event.target.value
                      )
                    ) {
                      return {
                        ...expr,
                        op1: event.target.value + ",null,null,null",
                      };
                    } else if (
                      field === "op2" &&
                      expr.op2 !== null &&
                      specialFunctions?.find(
                        (func) => func.value === event.target.value
                      )
                    ) {
                      return {
                        ...expr,
                        op2: event.target.value + ",null,null,null",
                      };
                    } else if (field === "op1" && expr.op1 !== null) {
                      return { ...expr, op1: event.target.value };
                    } else if (field === "operator") {
                      return { ...expr, operator: event.target.value };
                    } else if (field === "op2") {
                      console.log(event.target.value);
                      return { ...expr, op2: event.target.value };
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
  const handleComparatorChange = (event) => {
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
                  comparator: event.target.value,
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
    event
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
                            event.target.value +
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
                            event.target.value +
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
                            event.target.value +
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
                            event.target.value,
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
                            event.target.value +
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
                            event.target.value +
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
                            event.target.value +
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
                            event.target.value,
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
                  <Select
                    value={getInputAttribute(item?.op1, 0)}
                    onChange={(e) => handleSelectChange("lhs", "op1", index, e)}
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {inputAttribute?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                    {specialAttributes?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <Hr />
                    {specialFunctions?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <option value="__custom__">Custom Value</option>
                  </Select>

                  {(item?.op1 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op1, 0)
                    )) && (
                    <>
                      {(item?.op1 === "__custom__" ||
                        !specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        )) && (
                        <Input
                          value={item.value}
                          onChange={(e) =>
                            handleSelectChange("rhs", "op1", index, e)
                          }
                          placeholder="Enter Value"
                        />
                      )}
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        ) && (
                          <>
                            (
                            <Select
                              value={getInputAttribute(item?.op1, 1)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Select
                              </option>
                              {inputAttribute?.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                              {specialAttributes?.map((item) => (
                                <option key={item.name} value={item.value}>
                                  {item.name}
                                </option>
                              ))}
                            </Select>
                            ,
                            <Select
                              value={getInputAttribute(item?.op1, 2)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Select
                              </option>
                              {inputAttribute?.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Select>
                            ,
                            <Select
                              value={getInputAttribute(item?.op1, 3)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Unit
                              </option>
                              {getInputAttribute(item?.op1, 0) ===
                                "date_diff" && (
                                <>
                                  {dateUnits?.map((item, index) => (
                                    <option key={index} value={item.value}>
                                      {item.name}
                                    </option>
                                  ))}
                                </>
                              )}
                              {getInputAttribute(item?.op1, 0) ===
                                "time_diff" && (
                                <>
                                  {timeUnits?.map((item, index) => (
                                    <option key={index} value={item.value}>
                                      {item.name}
                                    </option>
                                  ))}
                                </>
                              )}
                            </Select>
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
                  <Select
                    value={item?.operator}
                    onChange={(e) =>
                      handleSelectChange("lhs", "operator", index, e)
                    }
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {arithmeticOperations?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </OutlineWrapper>
              )}
              {item?.op2 !== null && (
                <OutlineWrapper>
                  <Select
                    value={
                      inputAttribute?.includes(item?.op2)
                        ? item.op2
                        : "__custom__"
                    }
                    onChange={(e) => handleSelectChange("lhs", "op2", index, e)}
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {inputAttribute?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    {specialAttributes?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <option value="__custom__">Custom Value</option>
                  </Select>
                  {(item?.op2 === "__custom__" ||
                    inputAttribute?.includes(item?.op2) === false) && (
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        handleSelectChange("lhs", "op2", index, e)
                      }
                      placeholder="Enter Value"
                    />
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
            <VR key={index} />
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
          <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
          Add Expression
        </Button>

        {/* lhs */}
        <VR style={{ width: "5px" }} />

        <Select
          value={condition?.expression?.comparator}
          onChange={(e) => handleComparatorChange(e)}
          style={{ fontSize: "12px" }}
        >
          <option selected hidden>
            Select Boolean Operator
          </option>
          {comparisonOperations?.map((item) => (
            <option key={item.name} value={item.value}>
              {item.name}
            </option>
          ))}
        </Select>
        <VR style={{ width: "4px" }} />
        {/* rhs */}
        {condition.expression?.rhs?.map((item, index) => (
          <>
            <ConditionBody key={index}>
              {item?.op1 !== null && (
                <OutlineWrapper>
                  <Select
                    value={getInputAttribute(item?.op1, 0)}
                    onChange={(e) => handleSelectChange("rhs", "op1", index, e)}
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {inputAttribute?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                    {specialAttributes?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <Hr />
                    {specialFunctions?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <option value="__custom__">Custom Value</option>
                  </Select>

                  {(item?.op1 === "__custom__" ||
                    !inputAttribute?.includes(
                      getInputAttribute(item?.op1, 0)
                    )) && (
                    <>
                      {(item?.op1 === "__custom__" ||
                        !specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        )) && (
                        <Input
                          value={item.value}
                          onChange={(e) =>
                            handleSelectChange("rhs", "op1", index, e)
                          }
                          placeholder="Enter Value"
                        />
                      )}
                      {
                        // if the selected input attribute is a special function
                        specialFunctions?.find(
                          (func) =>
                            func.value === getInputAttribute(item?.op1, 0)
                        ) && (
                          <>
                            (
                            <Select
                              value={getInputAttribute(item?.op1, 1)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val1",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Select
                              </option>
                              {inputAttribute?.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                              {specialAttributes?.map((item) => (
                                <option key={item.name} value={item.value}>
                                  {item.name}
                                </option>
                              ))}
                            </Select>
                            ,
                            <Select
                              value={getInputAttribute(item?.op1, 2)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val2",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Select
                              </option>
                              {inputAttribute?.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Select>
                            ,
                            <Select
                              value={getInputAttribute(item?.op1, 3)}
                              onChange={(e) =>
                                handleFunctionInputAttributeChange(
                                  "val3",
                                  index,
                                  e
                                )
                              }
                            >
                              <option selected hidden>
                                Unit
                              </option>
                              {getInputAttribute(item?.op1, 0) ===
                                "date_diff" && (
                                <>
                                  {dateUnits?.map((item, index) => (
                                    <option key={index} value={item.value}>
                                      {item.name}
                                    </option>
                                  ))}
                                </>
                              )}
                              {getInputAttribute(item?.op1, 0) ===
                                "time_diff" && (
                                <>
                                  {timeUnits?.map((item, index) => (
                                    <option key={index} value={item.value}>
                                      {item.name}
                                    </option>
                                  ))}
                                </>
                              )}
                            </Select>
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
                  <Select
                    value={item.operator}
                    onChange={(e) =>
                      handleSelectChange("rhs", "operator", index, e)
                    }
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {arithmeticOperations?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </OutlineWrapper>
              )}
              {item?.op2 !== null && (
                <OutlineWrapper>
                  <Select
                    value={
                      inputAttribute?.includes(item?.op2)
                        ? item.op2
                        : "__custom__"
                    }
                    onChange={(e) => handleSelectChange("rhs", "op2", index, e)}
                  >
                    <option selected hidden>
                      Select
                    </option>
                    {inputAttribute?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    {specialAttributes?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    <option value="__custom__">Custom Value</option>
                  </Select>
                  {(item?.op2 === "__custom__" ||
                    inputAttribute?.includes(item?.op2) === false) && (
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        handleSelectChange("rhs", "op2", index, e)
                      }
                      placeholder="Enter Value"
                    />
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
            <VR key={index} />
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
          <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
          Add Expression
        </Button>
        <VR style={{ width: "6px" }} />
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
          <VR style={{ height: "10px", margin: "0px 20px", width: "2px" }} />
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
