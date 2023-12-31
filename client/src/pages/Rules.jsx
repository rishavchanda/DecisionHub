import React from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/ConditionalNode";
import AttributeNode from "../components/ArrtibuteNode";
import OutputNode from "../components/OutputNode";
import DownloadButton from "../components/DownloadButton";

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
        <DownloadButton />
      </ReactFlow>
    </div>
  );
};

export default Rules;
