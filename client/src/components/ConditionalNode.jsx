import React, { memo } from "react";
import styled, { useTheme } from "styled-components";
import {
  Handle,
  MarkerType,
  Position,
  getConnectedEdges,
  getOutgoers,
} from "reactflow";
import {
  AddRounded,
  SubtitlesRounded,
  BubbleChartRounded,
} from "@mui/icons-material";
import Conditions from "./Conditions";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Node = styled.div`
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 1px 1px 14px 0px ${({ theme }) => theme.shadow};
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
`;

const NodeHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const NodeBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  draggable: true;
`;

const NodeFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Hr = styled.div`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  gap: 8px;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
`;
const OutlineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
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

const VR = styled.div`
  width: 0.5px;
  height: 100%;
  background: ${({ theme }) => theme.text_secondary + 50};
`;

const BooleanCondition = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const No = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const Yes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const NodeButtons = styled.div`
  position: absolute;
  top: 250%;
  left: 10%;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const AddNoNode = styled.div`
  width: min-content;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 2px solid ${({ theme }) => theme.arrow};
  border-radius: 50px;
  padding: 6px 6px;
  font-size: 12px;
  &:hover {
    background: ${({ theme }) => theme.arrow};
    color: ${({ theme }) => theme.card};
  }
`;

function YesNode({ id, data, connectedEdges }) {
  const theme = useTheme();
  //check if node has yes egde and if sourceHandler is no
  const yesEdges = connectedEdges?.filter(
    (edge) => edge.source === id && edge.sourceHandle === "yes"
  );
  return (
    <Yes>
      <VR style={{ height: "60px", background: theme.arrow, width: "3px" }} />
      <OutlineWrapper
        style={{
          borderColor: theme.arrow,
          width: "100px",
          borderWidth: "3px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        Yes
      </OutlineWrapper>

      {yesEdges.length === 0 ? (
        <NodeButtons style={{ top: "170%", left: "-61%" }}>
          <AddNoNode>
            <AddRounded sx={{ fontSize: "14px" }} />
          </AddNoNode>
          <OutlineWrapper
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "2px",
              borderColor: theme.arrow,
              cursor: "pointer",
              padding: "12px 16px",
              gap: "8px",
              width: "max-content",
              fontSize: "16px",
              fontWeight: "500",
              "&:hover": {
                background: theme.text_secondary + 50,
                color: theme.card,
              },
            }}
          >
            <SubtitlesRounded sx={{ fontSize: "26px", color: theme.yellow }} />
            Add New Conditional Node
          </OutlineWrapper>
          <OutlineWrapper
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "2px",
              borderColor: theme.arrow,
              cursor: "pointer",
              padding: "12px 16px",
              gap: "8px",
              width: "max-content",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            <BubbleChartRounded sx={{ fontSize: "26px", color: theme.green }} />
            Add New Output Node
          </OutlineWrapper>
        </NodeButtons>
      ) : (
        <AddNoNode style={{ marginTop: "4px" }}>
          <AddRounded sx={{ fontSize: "18px" }} />
        </AddNoNode>
      )}
      <Handle id="yes" type="source" position={Position.Bottom} />
    </Yes>
  );
}

function NoNode({ id, data, connectedEdges }) {
  const theme = useTheme();
  //check if node has no egde and if sourceHandler is no
  const noEdges = connectedEdges?.filter(
    (edge) => edge.source === id && edge.sourceHandle === "no"
  );

  return (
    <No>
      <Hr style={{ height: "3px", background: theme.arrow, width: "100px" }} />
      <OutlineWrapper
        style={{
          borderColor: theme.arrow,
          borderWidth: "3px",
          width: "100px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        No
      </OutlineWrapper>
      {noEdges.length === 0 ? (
        <NodeButtons>
          <AddNoNode>
            <AddRounded sx={{ fontSize: "14px" }} />
          </AddNoNode>
          <OutlineWrapper
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "2px",
              borderColor: theme.arrow,
              cursor: "pointer",
              padding: "12px 16px",
              gap: "8px",
              width: "max-content",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            <SubtitlesRounded sx={{ fontSize: "26px", color: theme.yellow }} />
            Add New Conditional Node
          </OutlineWrapper>
          <OutlineWrapper
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: "2px",
              borderColor: theme.arrow,
              cursor: "pointer",
              padding: "12px 16px",
              gap: "8px",
              width: "max-content",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            <BubbleChartRounded sx={{ fontSize: "26px", color: theme.green }} />
            Add New Output Node
          </OutlineWrapper>
        </NodeButtons>
      ) : (
        <AddNoNode style={{ marginLeft: "4px" }}>
          <AddRounded sx={{ fontSize: "14px" }} />
        </AddNoNode>
      )}
      <Handle id="no" type="source" position={Position.Right} />
    </No>
  );
}

const flowData = {
  nodes: [
    {
      id: "1",
      type: "attributeNode",
      data: {
        label: "Loan Interest Rate",
        inputAttributes: ["account_no", "loan_duration", "date_of_birth"],
        resultAttributes: ["intrest_rate"],
      },
      position: { x: 234, y: 50 },
    },
    {
      id: "2",
      type: "conditionalNode",
      data: {
        label: "Conditional Node",
        inputAttributes: ["account_no", "loan_duration", "date_of_birth"],
        resultAttributes: ["intrest_rate"],
        rule: "Any",
        conditions: [
          {
            multiple: true,
            expression: [
              {
                inputAttribute: "annual_income",
                operator: "Divide",
                value: "12",
              },
              {
                inputAttribute: null,
                operator: "Greater than",
                value: "1000000",
              },
            ],
            boolean: "OR",
          },
          {
            multiple: false,
            expression: [
              {
                inputAttribute: "loan_duration",
                operator: "Greater than",
                value: "5",
              },
            ],
          },
        ],
      },
      position: { x: 100, y: 500 },
    },
    {
      id: "3",
      type: "outputNode",
      data: {
        label: "Output Node",
        inputAttributes: ["account_no", "loan_duration", "date_of_birth"],
        resultAttributes: ["test", "intrest_rate"],
        outputFields: [{ field: "intrest_rate", value: "5" }],
      },
      position: { x: 50, y: 1000 },
    },
  ],
  edges: [
    {
      id: "1-2",
      source: "1",
      target: "2",
      type: "smoothstep",
      sourceHandle: "input",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
      },
      style: {
        strokeWidth: 3,
      },
    },
    {
      id: "2-3",
      source: "2",
      target: "3",
      animated: true,
      sourceHandle: "no",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#FF0072",
      },
      style: {
        strokeWidth: 2,
        stroke: "#FF0072",
      },
    },
    {
      id: "2-3",
      source: "2",
      target: "3",
      animated: true,
      sourceHandle: "yes",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#FF0072",
      },
      style: {
        strokeWidth: 2,
        stroke: "#FF0072",
      },
    },
  ],
};

function ConditionalNode({ id, data }) {
  const theme = useTheme();
  const connectedEdges = getConnectedEdges(flowData.nodes, flowData.edges);
  return (
    <Wrapper>
      <FlexRight>
        <Node>
          <Handle id="input" type="target" position="top" />
          <NodeHeader>
            <NodeTitle>{data.label}</NodeTitle>
            <Flex>
              <OutlineWrapper>
                <Select value={data.rule}>
                  <option value="All">All</option>
                  <option value="Any">Any</option>
                </Select>
              </OutlineWrapper>
              Conditions must be TRUE
            </Flex>
          </NodeHeader>
          <NodeBody>
            {data.conditions?.map((condition, index) => (
              <>
                <Conditions
                  condition={condition}
                  inputAttribute={data.inputAttributes}
                  resultAttribute={data.resultAttributes}
                  withBoolean={condition.boolean}
                  booleanDisabled={index === data.conditions.length - 1}
                />
                {condition.boolean && (
                  <BooleanCondition>
                    <VR
                      style={{
                        height: "10px",
                        margin: "0px 20px",
                        width: "2px",
                        background: theme.secondary,
                      }}
                    />
                    <OutlineWrapper
                      style={{
                        borderColor: theme.secondary,
                        width: "fit-content",
                      }}
                    >
                      <Select value={condition.boolean}>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </Select>
                    </OutlineWrapper>
                    <VR
                      style={{
                        height: "10px",
                        margin: "0px 20px",
                        width: "2px",
                        background: theme.secondary,
                      }}
                    />
                  </BooleanCondition>
                )}
              </>
            ))}
          </NodeBody>
          <Hr />
          <NodeFooter>
            <Button>
              <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
              Add Condition
            </Button>
          </NodeFooter>
        </Node>
        <YesNode id={id} data={data} connectedEdges={connectedEdges} />
      </FlexRight>
      <NoNode id={id} data={data} connectedEdges={connectedEdges} />
    </Wrapper>
  );
}

export default memo(ConditionalNode);
