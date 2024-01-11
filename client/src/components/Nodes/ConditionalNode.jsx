import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  Handle,
  MarkerType,
  Position,
  getConnectedEdges,
  useReactFlow,
} from "reactflow";
import {
  AddRounded,
  SubtitlesRounded,
  BubbleChartRounded,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import Conditions from "./Conditions";
import { checkConditionType, logicalOperations } from "../../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { ruleUpdated } from "../../redux/reducers/rulesSlice";

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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const NodeTitle = styled.input`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  background: transparent;
  border: none;
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
  width: max-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
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
  font-size: 10px;
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
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 10px;
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
  left: -55%;
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
  background: ${({ theme }) => theme.card};
  border: 2px solid ${({ theme }) => theme.arrow};
  border-radius: 50px;
  padding: 6px 6px;
  font-size: 10px;
  &:hover {
    background: ${({ theme }) => theme.arrow};
    color: ${({ theme }) => theme.card};
  }
`;

const addNewConditionalNode = (
  currentNodeId,
  sourceHandle,
  reactFlow,
  data
) => {
  const existingNodes = reactFlow.getNodes();
  const parentNode = existingNodes.find((node) => node.id === currentNodeId);

  //calculate no of neighbours of the parent node having the same sourceHandle
  const noOfNeighbours = reactFlow
    .getEdges()
    .filter(
      (edges) =>
        edges.source === currentNodeId && edges.sourceHandle === sourceHandle
    ).length;

  const newNodeId = `${existingNodes.length + 1}`;
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
          expression: [
            {
              inputAttribute: "",
              operator: "",
              value: "",
            },
          ],
        },
      ],
    },
    position: calculateNodePosition(
      parentNode,
      parentNode.width,
      depth,
      noOfNeighbours,
      sourceHandle
    ), // Set the desired position
  };

  const newEdge = {
    id: `${currentNodeId}-${sourceHandle}-${newNodeId}`,
    source: currentNodeId,
    target: newNodeId,
    animated: false,
    sourceHandle,
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

const addNewOutputNode = (currentNodeId, sourceHandle, reactFlow, data) => {
  const existingNodes = reactFlow.getNodes();
  const parentNode = existingNodes.find((node) => node.id === currentNodeId);

  //calculate no of neighbours of the parent node having the same sourceHandle
  const noOfNeighbours = reactFlow
    .getEdges()
    .filter(
      (edges) =>
        edges.source === currentNodeId && edges.sourceHandle === sourceHandle
    ).length;

  const newNodeId = `${existingNodes.length + 1}`;
  const depth = parentNode.position.y + parentNode.height;

  const newNode = {
    id: newNodeId,
    type: "outputNode",
    data: {
      label: "New Output Node",
      inputAttributes: data.inputAttributes,
      outputAttributes: data.outputAttributes,
      outputFields: [{ field: "", value: "" }],
    },
    position: calculateNodePosition(
      parentNode,
      parentNode.width,
      depth,
      noOfNeighbours,
      sourceHandle
    ), // Set the desired position
  };

  const newEdge = {
    id: `${currentNodeId}-${sourceHandle}-${newNodeId}`,
    source: currentNodeId,
    target: newNodeId,
    animated: false,
    sourceHandle,
    style: {
      strokeWidth: 2,
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

const calculateNodePosition = (
  currentNode,
  width,
  depth,
  neighbourOffset,
  sourceHandle
) => {
  const offsetX =
    sourceHandle === "no"
      ? currentNode.position.x + width / 3 + 600 + 1200 * neighbourOffset
      : currentNode.position.x + width / 3 - 600 - 1200 * neighbourOffset; // Adjust as needed
  const offsetY = 200; // Adjust as needed
  const x = offsetX;
  const y = depth + offsetY;
  return { x, y };
};

const YesNode = ({ id, data }) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();
  const { updated } = useSelector((state) => state.rule);
  const [connectedEdges, setConnectedEdges] = useState(
    getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
  );

  const [yesEdges, setYesEdges] = useState([]);

  useEffect(() => {
    setYesEdges(
      getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges()).filter(
        (edge) => edge.source === id && edge.sourceHandle === "yes"
      )
    );
  }, [connectedEdges, id, updated, reactFlow]);

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
          fontSize: "18px",
        }}
      >
        Yes
      </OutlineWrapper>

      {yesEdges.length === 0 ? (
        <NodeButtons style={{ top: "170%", left: "-55%" }}>
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
              fontSize: "12px",
              fontWeight: "500",
              "&:hover": {
                background: theme.text_secondary + 50,
                color: theme.card,
              },
            }}
            onClick={async () => {
              await addNewConditionalNode(id, "yes", reactFlow, data);
              setConnectedEdges(
                getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
              );
            }}
          >
            <SubtitlesRounded sx={{ fontSize: "18px", color: theme.yellow }} />
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
              fontSize: "12px",
              fontWeight: "500",
            }}
            onClick={async () => {
              await addNewOutputNode(id, "yes", reactFlow, data);
              setConnectedEdges(
                getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
              );
            }}
          >
            <BubbleChartRounded sx={{ fontSize: "18px", color: theme.green }} />
            Add New Output Node
          </OutlineWrapper>
        </NodeButtons>
      ) : (
        <AddNoNode
          style={{ marginTop: "4px" }}
          onClick={async () => {
            await addNewConditionalNode(id, "yes", reactFlow, data);
            setConnectedEdges(
              getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
            );
          }}
        >
          <AddRounded sx={{ fontSize: "18px" }} />
        </AddNoNode>
      )}
      <Handle id="yes" type="source" position={Position.Bottom} />
    </Yes>
  );
};

const NoNode = ({ id, data }) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();
  const { updated } = useSelector((state) => state.rule);
  const [connectedEdges, setConnectedEdges] = useState(
    getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
  );

  const [noEdges, setNoEdges] = useState([]);

  useEffect(() => {
    //check if node has yes egde and if sourceHandler is no
    setNoEdges(
      getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges()).filter(
        (edge) => edge.source === id && edge.sourceHandle === "no"
      )
    );
  }, [reactFlow, connectedEdges, id, updated]);

  return (
    <No>
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
          marginTop: noEdges.length === 0 ? "0px" : "30px",
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
              fontSize: "14px",
              fontWeight: "500",
            }}
            onClick={async () => {
              await addNewConditionalNode(id, "no", reactFlow, data);
              setConnectedEdges(
                getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
              );
            }}
          >
            <SubtitlesRounded sx={{ fontSize: "20px", color: theme.yellow }} />
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
              fontSize: "14px",
              fontWeight: "500",
            }}
            onClick={async () => {
              await addNewOutputNode(id, "no", reactFlow, data);
              setConnectedEdges(
                getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
              );
            }}
          >
            <BubbleChartRounded sx={{ fontSize: "20px", color: theme.green }} />
            Add New Output Node
          </OutlineWrapper>
        </NodeButtons>
      ) : (
        <AddNoNode
          style={{
            marginTop: "4px",
          }}
          onClick={async () => {
            await addNewConditionalNode(id, "no", reactFlow, data);
            setConnectedEdges(
              getConnectedEdges(reactFlow.getNodes(), reactFlow.getEdges())
            );
          }}
        >
          <AddRounded sx={{ fontSize: "14px" }} />
        </AddNoNode>
      )}
      <Handle id="no" type="source" position={Position.Bottom} />
    </No>
  );
};

function ConditionalNode({ id, data }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const reactFlow = useReactFlow();

  // handel node title change
  const handelTitleChange = (event) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: event.target.value,
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // handel rule change
  const handelRuleChange = (event) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            rule: event.target.value,
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  const handelBooleanChange = (index, event) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, i) => {
            if (i === index) {
              return {
                ...condition,
                boolean: event.target.value,
              };
            } else {
              return condition;
            }
          }),
        };
        return {
          ...node,
          data: updatedData,
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // add condition to a node
  const addCondition = () => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        const updatedData = {
          ...node.data,
          conditions: [
            ...node.data.conditions,
            {
              multiple: false,
              expression: [
                {
                  inputAttribute: "",
                  operator: "Equal",
                  value: "",
                },
              ],
            },
          ],
        };
        return {
          ...node,
          data: updatedData,
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // delete condition
  const deleteCondition = (conditionIndex) => {
    let nodeIndex = 0;
    const updatedNodes = reactFlow.getNodes().map((node, index) => {
      if (node.id === id) {
        nodeIndex = index;
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions
            .map((condition, index) => {
              if (index === conditionIndex) {
                return {
                  ...condition,
                  boolean: null,
                };
              } else {
                return condition;
              }
            })
            .filter((condition, index) => index !== conditionIndex),
        };
        return {
          ...node,
          data: updatedData,
        };
      }
      return node;
    });

    // check if previous condition has boolean then make the boolean null
    if (conditionIndex !== 0) {
      if (updatedNodes[nodeIndex].data.conditions[conditionIndex - 1].boolean) {
        updatedNodes[nodeIndex].data.conditions[conditionIndex - 1].boolean =
          null;
      }
    }

    reactFlow.setNodes(updatedNodes);
  };

  // delete boolean condition and set boolean to null for a node
  const deleteBoolean = (index) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, i) => {
            if (i === index) {
              return {
                ...condition,
                boolean: null,
              };
            } else {
              return condition;
            }
          }),
        };
        return {
          ...node,
          data: updatedData,
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // add boolean condition to a node
  const addBooleanCondition = (index) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition, i) => {
            if (i === index) {
              return {
                ...condition,
                boolean: "&&",
              };
            } else {
              return condition;
            }
          }),
        };
        return {
          ...node,
          data: updatedData,
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // delete node
  const deleteNode = async () => {
    //first delete all edged connected to this node  and use getConnectedEdges
    const connectedEdges = await getConnectedEdges(
      [reactFlow.getNode(id, data)],
      reactFlow.getEdges()
    );
    const updatedEdges = await reactFlow.getEdges().filter((edge) => {
      return !connectedEdges.some(
        (connectedEdge) => connectedEdge.id === edge.id
      );
    });
    await reactFlow.setEdges(updatedEdges);

    // then delete node
    const updatedNodes = await reactFlow.getNodes().filter((node) => {
      return node.id !== id;
    });
    await reactFlow.setNodes(updatedNodes);
    dispatch(ruleUpdated());
  };

  return (
    <Wrapper>
      <FlexRight>
        <Node>
          <Handle id="input" type="target" position="top" />
          <NodeHeader>
            <NodeTitle
              value={data.label}
              onChange={(e) => handelTitleChange(e)}
            ></NodeTitle>
            <Flex style={{ width: "max-content" }}>
              <OutlineWrapper>
                <Select value={data.rule} onChange={(e) => handelRuleChange(e)}>
                  {checkConditionType.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </OutlineWrapper>
              <div>Conditions must be true</div>
            </Flex>

            <OutlineWrapper
              style={{
                borderColor: theme.red,
                color: theme.red,
                padding: "4px 6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
              onClick={() => deleteNode()}
            >
              <DeleteOutlineRounded
                sx={{ fontSize: "12px", color: theme.red }}
              />
              Delete
            </OutlineWrapper>
          </NodeHeader>
          <NodeBody>
            {data.conditions?.map((condition, index) => (
              <div key={index}>
                <Conditions
                  nodeId={id}
                  condition={condition}
                  conditionIndex={index}
                  inputAttribute={data.inputAttributes}
                  resultAttribute={data.outputAttributes}
                  withBoolean={condition.boolean}
                  booleanDisabled={index === data.conditions.length - 1}
                  deleteCondition={deleteCondition}
                  addBooleanCondition={addBooleanCondition}
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
                      <Select
                        value={condition.boolean}
                        onChange={(e) => {
                          handelBooleanChange(index, e);
                        }}
                      >
                        {logicalOperations.map((item) => (
                          <option value={item.value}>{item.name}</option>
                        ))}
                      </Select>
                      <DeleteOutlineRounded
                        sx={{
                          fontSize: "16px",
                          color: theme.text_secondary,
                          cursor: "pointer",
                        }}
                        onClick={() => deleteBoolean(index)}
                      />
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
              </div>
            ))}
          </NodeBody>
          <Hr />
          <NodeFooter>
            <Button onClick={() => addCondition()}>
              <AddRounded sx={{ fontSize: "16px", color: theme.primary }} />
              Add Condition
            </Button>
          </NodeFooter>
        </Node>
        <YesNode id={id} data={data} />
      </FlexRight>
      <Hr style={{ height: "3px", background: theme.arrow, width: "100px" }} />
      <NoNode id={id} data={data} />
    </Wrapper>
  );
}

export default ConditionalNode;
