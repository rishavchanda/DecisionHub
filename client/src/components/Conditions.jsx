import {
  AddRounded,
  DeleteOutlineRounded,
  DragIndicator,
} from "@mui/icons-material";
import React from "react";
import styled, { useTheme } from "styled-components";
import { arithmeticOperations } from "../utils/data";
import { useReactFlow } from "reactflow";

const Wrapper = styled.div`
  width: fit-content;
`;

const Condition = styled.div`
  draggable: true;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
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
  font-size: 12px;
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
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.card};
  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  max-width: 80px;
  background: transparent;
  border: none;
  font-size: 12px;
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
  font-size: 12px;
  ${({ booleanDisabled }) =>
    booleanDisabled &&
    `
    cursor: not-allowed;
  `}
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
}) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();

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

  return (
    <Wrapper>
      <Condition>
        <DragIndicator
          sx={{
            fontSize: "22px",
            color: theme.text_secondary,
            cursor: "pointer",
          }}
        />
        <VR />
        {condition.expression?.map((item, index) => (
          <>
            <ConditionBody>
              {item.inputAttribute !== null && (
                <OutlineWrapper>
                  <Select
                    value={item.inputAttribute}
                    onChange={(e) =>
                      handleSelectChange("inputAttribute", index, e)
                    }
                  >
                    {inputAttribute?.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </Select>
                </OutlineWrapper>
              )}
              <OutlineWrapper>
                <Select
                  value={item.operator}
                  onChange={(e) => handleSelectChange("operator", index, e)}
                >
                  {arithmeticOperations?.map((item) => (
                    <option value={item.value}>{item.name}</option>
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
                  <option value="__custom__">Custom Value</option>
                </Select>
                {(item.value === "__custom__" ||
                  inputAttribute?.includes(item.value) === false) && (
                  <Input
                    value={item.value}
                    onChange={(e) => handleSelectChange("value", index, e)}
                    placeholder="Enter Integer Value"
                    type="number"
                  />
                )}
              </OutlineWrapper>
            </ConditionBody>
            {index > 0 && (
              <DeleteOutlineRounded
                sx={{
                  fontSize: "20px",
                  color: theme.text_secondary,
                  cursor: "pointer",
                }}
                onClick={() => deleteExpression(index)}
              />
            )}
            <VR />
          </>
        ))}
        <Button onClick={() => addBlankExpression()}>
          <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
          Add Expression
        </Button>
        <VR />
        <DeleteOutlineRounded
          sx={{
            fontSize: "20px",
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
              fontSize: "12px",
              marginBottom: "8px",
            }}
            booleanDisabled={booleanDisabled}
            onClick={() =>
              !booleanDisabled && addBooleanCondition(conditionIndex)
            }
          >
            <AddRounded sx={{ fontSize: "16px", color: theme.primary }} />
            Add Boolean Condition
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default Conditions;
