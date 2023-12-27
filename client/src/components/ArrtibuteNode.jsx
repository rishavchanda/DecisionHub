import React from "react";
import styled, { useTheme } from "styled-components";
import { Handle } from "reactflow";
import { EditOutlined } from "@mui/icons-material";

const Node = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 300px;
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
  background: ${({ theme }) => theme.secondary};
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
  flex-direction: column;
  gap: 8px;
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
  gap: 6px;
`;

const Chip = styled.div`
  background: ${({ theme }) => theme.text_secondary + 10};
  border-radius: 30px;
  padding: 6px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const Hr = styled.div`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.text_secondary + 20};
  border-radius: 8px;
`;

const AttributeNode = ({ id, data }) => {
  const theme = useTheme();
  return (
    <Node>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <EditOutlined sx={{ fontSize: "18px", color: theme.white }} />
      </NodeHeader>
      <NodeBody>
        <ItemWrapper>
          <Title>Input Attribute</Title>
          <ChipsWrapper>
            {data.inputAttributes?.map((attribute) => (
              <Chip>{attribute}</Chip>
            ))}
          </ChipsWrapper>
        </ItemWrapper>
        <Hr />
        <ItemWrapper>
          <Title>Result Attribute</Title>
          <ChipsWrapper>
            {data.resultAttributes?.map((attribute) => (
              <Chip>{attribute}</Chip>
            ))}
          </ChipsWrapper>
        </ItemWrapper>
      </NodeBody>
      <Handle type="source" position="bottom" />
    </Node>
  );
};

export default AttributeNode;
