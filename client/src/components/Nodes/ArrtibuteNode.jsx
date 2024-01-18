import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Handle, MarkerType, getConnectedEdges, useReactFlow } from "reactflow";
import {
  AddRounded,
  EditOutlined,
  SubtitlesRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ruleUpdated } from "../../redux/reducers/rulesSlice";
import NewRuleForm from "../DialogForms/NewRuleForm";
import { nanoid } from "nanoid";
import GenerateWithAIForm from "../DialogForms/GenerateWithAIForm";
import { createRuleWithText } from "../../api";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Node = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 1px 1px 14px 0px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ computed, color }) =>
    computed &&
    color &&
    `border: 2px dashed ${color};
        box-shadow: 1px 2px 30px 1px ${color + 20};
  `}
`;

const NodeHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme.secondary};
  gap: 14px;
  border-radius: 8px 8px 0px 0px;
`;

const NodeTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
`;

const NodeBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px 16px 16px 16px;
  gap: 12px;
`;

const OutlineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 6px;
  font-size: 10px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const VR = styled.div`
  width: 0.5px;
  height: 100%;
  background: ${({ theme }) => theme.text_secondary + 50};
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
`;

const Chip = styled.div`
  background: ${({ theme }) => theme.text_secondary + 10};
  border-radius: 30px;
  padding: 6px 14px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const Hr = styled.div`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
`;

const NodeButtons = styled.div`
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
  gap: 6px;
  border: 2px solid ${({ theme }) => theme.arrow};
  border-radius: 50px;
  padding: 6px 6px;
  font-size: 10px;
  &:hover {
    background: ${({ theme }) => theme.arrow};
    color: ${({ theme }) => theme.card};
  }
`;

const AttributeNode = ({ id, data }) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();
  const dispatch = useDispatch();
  const location = useLocation();
  let path = location.pathname.split("/");
  const { updated } = useSelector((state) => state.rule);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isNotConnected, setIsNotConnected] = useState(false);

  useEffect(() => {
    setIsNotConnected(
      getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges()).filter(
        (edge) => edge.source === id
      ).length === 0
    );
  }, [id, updated, reactFlow]);

  const addNewConditionalNode = () => {
    const existingNodes = reactFlow.getNodes();
    const parentNode = existingNodes.find((node) => node.id === id);

    const newNodeId = nanoid(5);
    const depth = parentNode.position.y + parentNode.height;

    const newNode = {
      id: newNodeId,
      type: "conditionalNode",
      data: {
        label: "New Condition Node",
        inputAttributes: data.inputAttributes,
        outputAttributes: data.outputAttributes,
        rule: "Any",
        conditions: [
          {
            multiple: false,
            expression: {
              lhs: [
                {
                  op1: "",
                  operator: null,
                  op2: null,
                },
              ],
              comparator: "",
              rhs: [
                {
                  op1: "",
                  operator: null,
                  op2: null,
                },
              ],
            },
          },
        ],
      },
      position: {
        x: parentNode.position.x - 150,
        y: depth + 50,
      },
    };

    const newEdge = {
      id: `${id}-start-${newNodeId}`,
      source: id,
      target: newNodeId,
      animated: false,
      style: {
        strokeWidth: 3,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
      },
    };

    reactFlow.addNodes(newNode);
    reactFlow.addEdges(newEdge);
  };

  const generateAIRule = async (prompt) => {
    setLoading(true);
    console.log(path[2]);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await createRuleWithText(path[2], { conditions: prompt, version: 1 }, token)
      .then((res) => {
        dispatch(
          openSnackbar({
            message: "Created new rule with AI! Please refresh.",
            severity: "success",
          })
        );
        dispatch(ruleUpdated());
        setLoading(false);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
        setLoading(false);
      });
  };

  return (
    <Wrapper>
      <Node color={data?.color} computed={data?.computed}>
        <NodeHeader color={data?.color} computed={data?.computed}>
          <NodeTitle>{data.label}</NodeTitle>
          <EditOutlined
            sx={{ fontSize: "16px", color: theme.white, cursor: "pointer" }}
            onClick={() => setOpenUpdateDialog(true)}
          />
        </NodeHeader>
        <NodeBody>
          <ItemWrapper>
            <Title>Input Attribute</Title>
            <ChipsWrapper>
              {data.inputAttributes?.map((attribute, index) => (
                <Chip key={index}>{attribute}</Chip>
              ))}
            </ChipsWrapper>
          </ItemWrapper>
          <Hr />
          <ItemWrapper>
            <Title>Result Attribute</Title>
            <ChipsWrapper>
              {data.outputAttributes?.map((attribute, index) => (
                <Chip key={index}>{attribute}</Chip>
              ))}
            </ChipsWrapper>
          </ItemWrapper>
        </NodeBody>
        <Handle type="source" position="bottom" />
      </Node>
      {isNotConnected && (
        <>
          <VR
            style={{ height: "60px", background: theme.arrow, width: "3px" }}
          />
          <NodeButtons>
            <AddNoNode>
              <AddRounded sx={{ fontSize: "14px" }} />
            </AddNoNode>
            <GenerateWithAIForm
              loading={loading}
              submitPrompt={(prompt) => generateAIRule(prompt)}
            />
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
                fontSize: "12px",
                fontWeight: "500",
                "&:hover": {
                  background: theme.text_secondary + 50,
                  color: theme.card,
                },
              }}
              onClick={async () => {
                await addNewConditionalNode(id, "yes", reactFlow, data);
                dispatch(ruleUpdated());
              }}
            >
              <SubtitlesRounded
                sx={{ fontSize: "18px", color: theme.yellow }}
              />
              Add New Conditional Node
            </OutlineWrapper>
          </NodeButtons>
        </>
      )}
      {openUpdateDialog && (
        <NewRuleForm
          setOpenNewRule={setOpenUpdateDialog}
          updateForm={{
            update: true,
            id: id,
            data: {
              title: data.label,
              description: data?.description,
              inputAttributes: data.inputAttributes,
              outputAttributes: data.outputAttributes,
              condition: JSON.stringify({
                nodes: reactFlow.getNodes(),
                edges: reactFlow.getEdges(),
              }),
            },
          }}
        />
      )}
    </Wrapper>
  );
};

export default AttributeNode;
