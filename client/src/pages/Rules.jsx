import React from "react";
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/ConditionalNode";
import AttributeNode from "../components/ArrtibuteNode";
import OutputNode from "../components/OutputNode";

const inputAttributes = ["account_no", "loan_duration", "date_of_birth"];
const resultAttributes = ["intrest_rate", "test"];

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
    {
      id: "2",
      type: "conditionalNode",
      inputAttributes,
      resultAttributes,
      data: {
        label: "Conditional Node",
        inputAttributes: inputAttributes,
        resultAttributes: resultAttributes,
        rule: "Any",
        conditions: [
          {
            multiple: true,
            expression: [
              {
                inputAttribute: "",
                operator: "",
                value: "",
              },
            ],
            boolean: null,
          },
        ],
      },
      position: { x: 100, y: 500 },
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
  ],
};

const Rules = () => {
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
      </ReactFlow>
    </div>
  );
};

export default Rules;
