import { OpenInNewRounded } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  @media (max-width: 400px) {
    min-width: 190px;
  }
`;

const Flex = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 400px) {
    font-size: 9px;
  }
`;

const Open = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.green};
  }
`;

const SearchItemCard = ({ item, setOpenSearch, setSearch }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <Flex>
        <Title>{item?.title}</Title>
        <Description>{item?.description}</Description>
      </Flex>
      <Open
        onClick={() => {
          navigate(`/rules/${item?.id}`);
          setSearch([]);
          setOpenSearch(false);
        }}
      >
        <OpenInNewRounded style={{ fontSize: "14px", color: "inherit" }} />
      </Open>
    </Card>
  );
};

export default SearchItemCard;
