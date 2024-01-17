import React from "react";
import styled, { useTheme } from "styled-components";
import { AccessTimeOutlined, CalendarTodayOutlined } from "@mui/icons-material";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";

const Image = styled.img`
  width: 100%;
  height: 120px;
  object-fit: scale-down;
  background: ${({ theme }) => theme.black + 50};
  border-radius: 10px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 1px 1px 10px 2px ${({ theme }) => theme.black + 10};
  padding: 16px 16px;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 1px 1px 10px 2px ${({ theme }) => theme.black + 20};
  }
  &:hover ${Image} {
    background: ${({ theme }) => theme.black + 60};
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 6px 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.text_secondary + 10};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 10px;
  ${({ green, theme }) =>
    green &&
    `
  background: ${theme.green + 10};
  color: ${theme.green};
  `}
`;

const LastUpdated = styled.div`
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Description = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const CreatedOn = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 90};
  margin-top: 4px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
`;

const Button = styled.div`
  width: max-content;
  padding: 3px 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  &:hover {
    background: ${({ theme }) => theme.primary + 80};
  }
`;

const RulesCard = ({ rule, test }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Card onClick={() => !test && navigate(`/rules/${rule?.id}`)}>
      {/* <Image src="https://firebasestorage.googleapis.com/v0/b/flexi-coding.appspot.com/o/reactflow%20(11).png?alt=media&token=6c50b741-cbb9-4a9f-bdcd-7b6aa2aa56f4" /> */}
      <CardTop>
        {rule.tested ? <Tag green>Tested</Tag> : <Tag>Not Tested</Tag>}
        <Flex>
          <AccessTimeOutlined
            sx={{ color: theme.text_secondary, fontSize: "16px" }}
          />
          <LastUpdated>Updated: {format(rule?.updatedAt)}</LastUpdated>
        </Flex>
      </CardTop>
      <div>
        <Title>{rule?.title}</Title>
        <Description>{rule?.description}</Description>
      </div>
      <Flex
        style={{
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Flex>
          <CalendarTodayOutlined
            sx={{ color: theme.text_secondary + 90, fontSize: "12px" }}
          />
          <CreatedOn>
            Created On:{" "}
            {rule?.createdAt &&
              new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(`${rule?.createdAt}`))}
          </CreatedOn>
        </Flex>
        {test && (
          <Button onClick={() => navigate(`/test/${rule?.id}`)}>
            Test Now
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export default RulesCard;
