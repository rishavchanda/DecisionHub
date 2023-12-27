import React from "react";
import ReactFlow, { Controls, Background, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/ConditionalNode";
import AttributeNode from "../components/ArrtibuteNode";
import OutputNode from "../components/OutputNode";

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

const Rules = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={flowData.nodes}
        edges={flowData.edges}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Rules;
