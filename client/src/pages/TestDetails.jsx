/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionalNode from "../components/Nodes/ConditionalNode";
import AttributeNode from "../components/Nodes/ArrtibuteNode";
import OutputNode from "../components/Nodes/OutputNode";
import styled, { useTheme } from "styled-components";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { ArrowBackRounded, EditRounded } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getRuleById, testRule, uploadExcel } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { ruleReload } from "../redux/reducers/rulesSlice";
import TestRuleForm from "../components/DialogForms/TestRuleForm";
import ResultDialog from "../components/ResultDialog";

const FlexDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
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
  padding: 8px 14px;
  margin: 6px 0px;
  font-size: 12px;
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

const nodeTypes = {
  attributeNode: AttributeNode,
  conditionalNode: ConditionalNode,
  outputNode: OutputNode,
};

const TestDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  let path = location.pathname.split("/");
  const { reload } = useSelector((state) => state.rule);
  const { setViewport } = useReactFlow();

  //Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const dispath = useDispatch();

  const [inputAttributes, setInputAttributes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [rule, setRule] = useState();
  const [output, setOutput] = useState([]);
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState();

  //loader
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [showResult, setShowResult] = useState({ open: false, result: [] });

  //Functions

  const getRule = async () => {
    setLoading(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await getRuleById(id, token, version)
      .then(async (res) => {
        setRule(res.data?.rule);
        setInputAttributes(res.data?.rule?.inputAttributes);
        setVersions(res.data?.versions);
        await createFlow(res.data?.rule);
        console.log(res.data?.rule);
        setLoading(false);
      })
      .catch((err) => {
        dispath(
          openSnackbar({
            message: err.response?.data.message,
            severity: "error",
          })
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getRule();
  }, [reload, version]);

  const createFlow = async (rule) => {
    setLoading(true);
    const { nodes, edges } = JSON.parse(rule?.condition);
    await nodes.forEach((node) => {
      if (node.type === "attributeNode") {
        node.data.label = rule.title;
      }
      node.data.inputAttributes = rule?.inputAttributes;
      node.data.outputAttributes = rule?.outputAttributes;
    });
    await setNodes(nodes);
    await setEdges(edges);
    setLoading(false);
  };

  const getTestedRule = async (testData) => {
    setSubmitLoading(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await testRule(id, rule?.version, testData, token)
      .then(async (res) => {
        await setRule(res.data?.rule);
        await setOutput(res.data?.output);
        await setInputAttributes(res.data?.rule?.inputAttributes);
        await createFlow(res.data?.rule);
        setSubmitLoading(false);
      })
      .catch((err) => {
        dispath(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
        setSubmitLoading(false);
      });
  };

  const handelSubmitTestData = (testData) => {
    getTestedRule(testData);
  };

  const handelExcelSubmit = async (excelData) => {
    var formData = new FormData();
    formData.append("file", excelData);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    setExcelLoading(true);
    await uploadExcel(formData, id, token)
      .then((res) => {
        console.log(res.data);
        setShowResult({ open: true, result: res.data });
        setExcelLoading(false);
      })
      .catch((err) => {
        dispath(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
        setExcelLoading(false);
      });
  };

  useEffect(() => {
    setViewport({ x: 200, y: 0, zoom: 1 }, { duration: 800 });
  }, [reload, setViewport, getRule, getTestedRule]);

  return (
    <div style={{ height: "100%" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          elementsSelectable={false}
          setNodes={setNodes}
          setEdges={setEdges}
          fitView={true}
        >
          <Background />
          <Controls />
          <Panel position="top-left">
            <TextButton onClick={() => navigate("/test/")}>
              <ArrowBackRounded sx={{ fontSize: "16px" }} />
              Back
            </TextButton>
          </Panel>
          <Panel position="top-right">
            <FlexDisplay>
              <Select
                value={rule?.version}
                onChange={(e) => {
                  setVersion(e.target.value);
                  dispath(ruleReload());
                }}
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
                {versions?.map((version) => (
                  <MenuItem value={version}>Version: {version}</MenuItem>
                ))}
              </Select>
              <TestRuleForm
                attributes={inputAttributes}
                loading={submitLoading}
                submitTestData={(testData) => handelSubmitTestData(testData)}
                output={output}
                excelLoading={excelLoading}
                submitExcelData={(excelData) => handelExcelSubmit(excelData)}
              />
              <Button onClick={() => navigate(`/rules/${path[2]}`)}>
                <EditRounded style={{ fontSize: "12px" }} /> Edit Rule
              </Button>
            </FlexDisplay>
          </Panel>
          <Panel position="bottom-right"></Panel>
        </ReactFlow>
      )}
      {showResult.open && (
        <ResultDialog result={showResult.result} setResult={setShowResult} />
      )}
    </div>
  );
};

export default TestDetails;
