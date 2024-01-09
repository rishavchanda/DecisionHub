import React, { useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/Nodes/ConditionalNode";
import AttributeNode from "../components/Nodes/ArrtibuteNode";
import OutputNode from "../components/Nodes/OutputNode";
import styled, { useTheme } from "styled-components";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import {
  ArrowBackRounded,
  DeleteOutlineRounded,
  SaveRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const FlexDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

const DeleteButton = styled.div`
  border: 2px solid ${({ theme }) => theme.red + 90};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.red};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  span {
    font-weight: 500;
  }
  &:hover {
    background-color: ${({ theme }) => theme.red + 10};
  }
`;

const TextButton = styled.div`
  border-radius: 8px;
  padding: 4px 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text_primary};
    background-color: ${({ theme }) => theme.text_secondary + 10};
  }
`;

const Button = styled.div`
  border-radius: 6px;
  padding: 10px 16px;
  margin: 8px 0px;
  font-size: 13px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primary + 90};
  }

  ${({ disabled, theme }) =>
    disabled &&
    `
    background-color: ${theme.primary + 50};
    cursor: not-allowed;
  `}
`;

const inputAttributes = [
  "account_no",
  "loan_duration",
  "date_of_birth",
  "employment_status",
  "annual_income",
  "credit_score",
];
const outputAttributes = ["intrest_rate"];

const nodeTypes = {
  attributeNode: AttributeNode,
  conditionalNode: ConditionalNode,
  outputNode: OutputNode,
};
const flowData = {
  nodes: [
    {
      id: "1",
      type: "attributeNode",
      data: {
        label: "Loan Interest Rate",
        inputAttributes: inputAttributes,
        outputAttributes: outputAttributes,
      },
      position: { x: 234, y: 50 },
    },
  ],
  edges: [],
};

const RulesDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);
  const [saveLoading, setSaveLoading] = useState(false);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={true}
        elementsSelectable={true}
        setNodes={setNodes}
        setEdges={setEdges}
        fitView={true}
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          <TextButton onClick={() => navigate("/rules/")}>
            <ArrowBackRounded sx={{ fontSize: "16px" }} />
            Back to Rules
          </TextButton>
        </Panel>
        <Panel position="top-right">
          <FlexDisplay>
            <Select
              value="1.1"
              autoWidth
              displayEmpty
              size="small"
              sx={{
                color: theme.text_primary,
                border: `1px solid ${theme.text_secondary + 90}`,
                borderRadius: "8px",
                padding: "0px",
                fontSize: "12px",
                ".MuiSvgIcon-root ": {
                  fill: `${theme.text_secondary} !important`,
                },
              }}
            >
              <MenuItem value="1.1">Version: 1.0</MenuItem>
              <MenuItem value="2.2">Version: 1.1</MenuItem>
              <MenuItem value="3.3">Version: 1.2</MenuItem>
            </Select>
            <DeleteButton>
              <DeleteOutlineRounded sx={{ fontSize: "16px" }} />
              <span>Delete Rule</span>
            </DeleteButton>
          </FlexDisplay>
        </Panel>
        <Panel position="bottom-right">
          <Button disabled={saveLoading}>
            {saveLoading ? (
              <>
                <CircularProgress
                  sx={{
                    color: "inherit",
                    width: "16px !important",
                    height: "16px !important",
                  }}
                />
                Saving...
              </>
            ) : (
              <>
                <SaveRounded sx={{ fontSize: "16px" }} />
                Save Rule
              </>
            )}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default RulesDetails;
