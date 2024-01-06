import React from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/ConditionalNode";
import AttributeNode from "../components/ArrtibuteNode";
import OutputNode from "../components/OutputNode";
import DownloadButton from "../components/DownloadButton";
import styled, { useTheme } from "styled-components";
import { MenuItem, Select } from "@mui/material";
import { DeleteOutlineRounded } from "@mui/icons-material";

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

const inputAttributes = [
  "account_no",
  "loan_duration",
  "date_of_birth",
  "employment_status",
  "annual_income",
  "credit_score",
];
const resultAttributes = ["intrest_rate"];

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
        resultAttributes: resultAttributes,
      },
      position: { x: 234, y: 50 },
    },
  ],
  edges: [],
};

const Rules = () => {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);

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
      </ReactFlow>
    </div>
  );
};

export default Rules;
