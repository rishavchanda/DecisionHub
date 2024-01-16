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
  specialAttributes,
  specialFunctions,
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
  const handleSelectChange = (field, expressionIndex, event) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              return {
                ...condition,
                expression: condition.expression.map((expr, eIndex) => {
                  if (eIndex === expressionIndex) {
                    if (
                      field === "inputAttribute" &&
                      expr.inputAttribute !== null &&
                      specialFunctions?.find(
                        (func) => func.value === event.target.value
                      )
                    ) {
                      return {
                        ...expr,
                        inputAttribute: event.target.value + ",null,null",
                      };
                    } else if (
                      field === "inputAttribute" &&
                      expr.inputAttribute !== null
                    ) {
                      return { ...expr, inputAttribute: event.target.value };
                    } else if (field === "operator") {
                      return { ...expr, operator: event.target.value };
                    } else if (field === "value") {
                      return { ...expr, value: event.target.value };
                    }
                  }
                  return expr;
                }),
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
    if (value.split(",")[pos] !== null || undefined || "")
      return (value = value.split(",")[pos]);
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
                expression: condition.expression.map((expr, eIndex) => {
                  if (eIndex === expressionIndex) {
                    if (field === "fun" && expr.inputAttribute !== null) {
                      return {
                        ...expr,
                        inputAttribute:
                          event.target.value +
                          "," +
                          getInputAttribute(expr.inputAttribute, 1) +
                          "," +
                          getInputAttribute(expr.inputAttribute, 2),
                      };
                    } else if (field === "val1") {
                      return {
                        ...expr,
                        inputAttribute:
                          getInputAttribute(expr.inputAttribute, 0) +
                          "," +
                          event.target.value +
                          "," +
                          getInputAttribute(expr.inputAttribute, 2),
                      };
                    } else if (field === "val2") {
                      return {
                        ...expr,
                        inputAttribute:
                          getInputAttribute(expr.inputAttribute, 0) +
                          "," +
                          getInputAttribute(expr.inputAttribute, 1) +
                          "," +
                          event.target.value,
                      };
                    }
                  }
                  return expr;
                }),
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
  const addBlankExpression = () => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              return {
                ...condition,
                expression: [
                  ...condition.expression,
                  { inputAttribute: null, operator: "", value: "" },
                ],
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
  const deleteExpression = (expressionIndex) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === nodeId) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, cIndex) => {
            if (cIndex === conditionIndex) {
              return {
                ...condition,
                expression: condition.expression.filter(
                  (expr, eIndex) => eIndex !== expressionIndex
                ),
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
        {condition.expression?.map((item, index) => (
          <>
            <ConditionBody key={index}>
              {item.inputAttribute !== null && (
                <OutlineWrapper>
                  <Select
                    value={getInputAttribute(item.inputAttribute, 0)}
                    onChange={(e) =>
                      handleSelectChange("inputAttribute", index, e)
                    }
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
                  </Select>
                  {/* When a special function is selected i have to show two more selectable options and make a final string and set that as the value */}
                  {
                    // if the selected input attribute is a special function
                    specialFunctions?.find(
                      (func) =>
                        func.value === getInputAttribute(item.inputAttribute, 0)
                    ) && (
                      <>
                        (
                        <Select
                          value={getInputAttribute(item.inputAttribute, 1)}
                          onChange={(e) =>
                            handleFunctionInputAttributeChange("val1", index, e)
                          }
                        >
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
                          value={getInputAttribute(item.inputAttribute, 2)}
                          onChange={(e) =>
                            handleFunctionInputAttributeChange("val2", index, e)
                          }
                        >
                          {inputAttribute?.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </Select>
                        )
                      </>
                    )
                  }
                </OutlineWrapper>
              )}
              <OutlineWrapper>
                <Select
                  value={item.operator}
                  onChange={(e) => handleSelectChange("operator", index, e)}
                >
                  {arithmeticOperations?.map((item) => (
                    <option key={item.name} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </OutlineWrapper>
              <OutlineWrapper>
                <Select
                  value={
                    inputAttribute?.includes(item.value)
                      ? item.value
                      : "__custom__"
                  }
                  onChange={(e) => handleSelectChange("value", index, e)}
                >
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
                {(item.value === "__custom__" ||
                  inputAttribute?.includes(item.value) === false) && (
                  <Input
                    value={item.value}
                    onChange={(e) => handleSelectChange("value", index, e)}
                    placeholder="Enter Value"
                  />
                )}
              </OutlineWrapper>
            </ConditionBody>
            {index > 0 && (
              <DeleteOutlineRounded
                key={index}
                sx={{
                  fontSize: "18px",
                  color: theme.text_secondary,
                  cursor: "pointer",
                }}
                onClick={() => deleteExpression(index)}
              />
            )}
            <VR key={index} />
          </>
        ))}
        <Button onClick={() => addBlankExpression()}>
          <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
          Add Expression
        </Button>
        <VR />
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
