import React from "react";
import styled, { useTheme } from "styled-components";
import { Handle, getConnectedEdges, useReactFlow } from "reactflow";
import {
  AddRounded,
  DeleteOutlineRounded,
  DeleteRounded,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { ruleUpdated } from "../../redux/reducers/rulesSlice";

const Node = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 1px 1px 14px 0px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  padding: 10px 16px;
  background: ${({ theme }) => theme.output_node};
  gap: 16px;
  border-radius: 8px 8px 0px 0px;
  ${({ computed, color }) =>
    computed &&
    color &&
    `
        background: ${color};
  `}
`;

const NodeTitle = styled.input`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  background: transparent;
  border: none;
`;

const NodeBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px 16px 16px 16px;
  gap: 14px;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
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
const Hr = styled.div`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
`;

const NodeFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  font-size: 12px;
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

const OutputNode = ({ id, data, outputAttributes }) => {
  const theme = useTheme();
  const reactFlow = useReactFlow();
  const dispatch = useDispatch();

  //handel change output node title
  const handelLabelChange = (e) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: e.target.value,
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // add output field
  const addOutputField = () => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            outputFields: [
              ...node.data.outputFields,
              {
                field: "",
                size: "",
              },
            ],
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // delete output field
  const deleteOutputField = (index) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            outputFields: node.data.outputFields.filter(
              (field, i) => i !== index
            ),
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  // handle select change
  const handleSelectChange = (field, index, e) => {
    const updatedNodes = reactFlow.getNodes().map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            outputFields: node.data.outputFields.map((item, i) => {
              if (i === index) {
                if (field === "field") {
                  return { ...item, field: e.target.value };
                } else if (field === "value") {
                  return { ...item, value: e.target.value };
                }
              }
              return item;
            }),
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  const deleteNode = async () => {
    //first delete all edged connected to this node  and use getConnectedEdges
    const connectedEdges = getConnectedEdges(
      [reactFlow.getNode(id, data)],
      reactFlow.getEdges()
    );
    const updatedEdges = reactFlow.getEdges().filter((edge) => {
      return !connectedEdges.some(
        (connectedEdge) => connectedEdge.id === edge.id
      );
    });
    await reactFlow.setEdges(updatedEdges);

    // then delete node
    const updatedNodes = reactFlow.getNodes().filter((node) => {
      return node.id !== id;
    });
    await reactFlow.setNodes(updatedNodes);

    dispatch(ruleUpdated());
  };

  return (
    <Node color={data?.color} computed={data?.computed}>
      <NodeHeader color={data?.color} computed={data?.computed}>
        <NodeTitle
          value={data.label}
          onChange={(e) => handelLabelChange(e)}
        ></NodeTitle>
        <OutlineWrapper
          style={{
            borderWidth: 2,
            padding: "6px 8px",
            cursor: "pointer !important",
            borderColor: theme.white + 50,
            color: theme.white,
          }}
          onClick={() => deleteNode()}
        >
          <DeleteRounded sx={{ fontSize: "14px" }} />
          Delete
        </OutlineWrapper>
      </NodeHeader>
      <NodeBody>
        {data.outputFields?.map((field, index) => (
          <ItemWrapper>
            <OutlineWrapper style={{ width: "fit-content" }}>
              <Select
                value={field.field}
                onChange={(e) => handleSelectChange("field", index, e)}
              >
                <option selected hidden>
                  Select
                </option>
                {data.outputAttributes?.map((attribute) => (
                  <option value={attribute}>{attribute}</option>
                ))}
              </Select>
            </OutlineWrapper>
            <OutlineWrapper style={{ width: "fit-content" }}>
              <Select
                value={
                  data.inputAttributes?.includes(field.value)
                    ? field.value
                    : "__custom__"
                }
                onChange={(e) => handleSelectChange("value", index, e)}
              >
                {data.inputAttributes?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="__custom__">Custom Value</option>
              </Select>
              {(field.value === "__custom__" ||
                data.inputAttributes?.includes(field.value) === false) && (
                <Input
                  value={field.value}
                  onChange={(e) => handleSelectChange("value", index, e)}
                  placeholder="Enter Value"
                />
              )}
            </OutlineWrapper>
            <DeleteOutlineRounded
              sx={{
                fontSize: "20px",
                color: theme.text_secondary,
                cursor:
                  reactFlow.getNode(id)?.data?.outputFields?.length === 1 &&
                  index === 0
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={() => {
                reactFlow.getNode(id)?.data?.outputFields?.length > 1 &&
                  deleteOutputField(index);
              }}
            />
          </ItemWrapper>
        ))}
        <Hr />
        <NodeFooter>
          <Button onClick={() => addOutputField()}>
            <AddRounded sx={{ fontSize: "16px", color: theme.primary }} />
            Add Fields
          </Button>
        </NodeFooter>
      </NodeBody>
      <Handle type="target" position="top" />
    </Node>
  );
};

export default OutputNode;
