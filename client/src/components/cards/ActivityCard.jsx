import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styled, { useTheme } from "styled-components";
import { AccountTreeRounded, RuleRounded } from "@mui/icons-material";

const Card = styled.div`
  background-color: ${(props) => props.theme.card};
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: space-between;
  box-shadow: 1px 1px 10px 1px ${({ theme }) => theme.black + 10};
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  color: ${(props) => props.theme.text_secondary};
  font-size: 12px;
  font-weight: 400;
  @media (max-width: 600px) {
    font-size: 8px;
  }
`;

const Main = styled.div`
  color: ${(props) => props.theme.text_primary};
  font-size: 24px;
  font-weight: 600;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const ActivityCard = ({ rule, title, percentage, total }) => {
  const theme = useTheme();
  return (
    <Card>
      <Flex style={{ flexDirection: "row", gap: "6px" }}>
        {rule ? (
          <AccountTreeRounded
            sx={{
              fontSize: "12px",
              padding: "4px",
              background: theme.secondary + 10,
              color: theme.secondary,
              borderRadius: "50%",
            }}
          />
        ) : (
          <RuleRounded
            sx={{
              fontSize: "12px",
              padding: "4px",
              background: theme.green + 10,
              color: theme.primary,
              borderRadius: "50%",
            }}
          />
        )}
        <Flex>
          <Title>{title}</Title>
          <Main>{total}</Main>
        </Flex>
      </Flex>
      <div style={{ width: "50px", height: "50px", padding: "2px" }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={{
            path: {
              stroke: rule ? theme.secondary : theme.green,
            },
            trail: {
              stroke: theme.text_secondary + 20,
            },
            text: {
              fill: rule ? theme.secondary : theme.green,
              fontSize: "17px",
              fontWeight: "600",
            },
          }}
        />
      </div>
    </Card>
  );
};

export default ActivityCard;
