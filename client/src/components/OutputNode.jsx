import React from "react";
import styled, { useTheme } from "styled-components";
import { Handle } from "reactflow";
import { AddRounded, EditOutlined } from "@mui/icons-material";

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
`;

const NodeHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 16px;
  background: ${({ theme }) => theme.text_secondary + 20};
  gap: 16px;
  border-radius: 8px 8px 0px 0px;
`;

const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
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
  gap: 8px;
`;

const OutlineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 9px 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  &:focus {
    outline: none;
  }
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
  font-size: 14px;
`;

const OutputNode = ({ id, data }) => {
  const theme = useTheme();
  return (
    <Node>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <EditOutlined sx={{ fontSize: "18px", color: theme.white }} />
      </NodeHeader>
      <NodeBody>
        {data.outputFields?.map((field) => (
          <ItemWrapper>
            <OutlineWrapper style={{ width: "fit-content" }}>
              <Select value={field.field}>
                {data.resultAttributes?.map((attribute) => (
                  <option value={attribute}>{attribute}</option>
                ))}
              </Select>
            </OutlineWrapper>
            <OutlineWrapper style={{ width: "fit-content" }}>
              <Select>
                <option value="5">5</option>
              </Select>
            </OutlineWrapper>
          </ItemWrapper>
        ))}
        <Hr />
        <NodeFooter>
          <Button>
            <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
            Add Fields
          </Button>
        </NodeFooter>
      </NodeBody>
      <Handle type="target" position="top" />
    </Node>
  );
};

export default OutputNode;
