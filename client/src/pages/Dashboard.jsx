import { AddRounded, RuleRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import RulesCard from "../components/cards/RulesCard";
import { getRecentActivity } from "../api";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../components/cards/ActivityCard";
import { Skeleton } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Button = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 24px;
  @media (max-width: 600px) {
    padding: 8px 12px;
  }
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: ${({ fontSize }) => fontSize || "18px"};
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    font-size: ${({ smallfontSize }) => smallfontSize || "18px"};
  }
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  grid-gap: 16px 16px;
  margin-bottom: 20px;
`;

const TextButton = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const Dashboard = ({ setOpenNewRule }) => {
  // Hooks
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [recentRules, setRecentRules] = useState([]);
  const [total, setTotal] = useState(0);
  const [tested, setTested] = useState(0);
  const [loading, setLoading] = useState(false);

  const getReentRules = async () => {
    setLoading(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await getRecentActivity(token)
      .then((res) => {
        setRecentRules(res?.data?.rules);
        setTotal(res?.data?.total);
        setTested(res?.data?.tested);
        setLoading(false);
      })
      .catch((err) => {
        dispath(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getReentRules();
  }, []);

  return (
    <Container>
      <TopSection>
        {loading ? (
          <Flex>
            <Skeleton variant="rounded" height={80} width={200} />
            <Skeleton variant="rounded" height={80} width={200} />
          </Flex>
        ) : (
          <Flex>
            <ActivityCard
              rule
              title="Total Rules"
              percentage={((total / 20) * 100).toFixed(1)}
              total={total}
            />
            <ActivityCard
              title="Tested Rules"
              percentage={((tested / total) * 100).toFixed(1)}
              total={tested}
            />
          </Flex>
        )}
        <Flex>
          <Button onClick={() => setOpenNewRule(true)}>
            <AddRounded sx={{ fontSize: "22px" }} />
            Create New Rule
          </Button>
          <Button style={{ background: "#9747FF" }}>
            <RuleRounded sx={{ fontSize: "22px" }} />
            Test Rules
          </Button>
        </Flex>
      </TopSection>
      {loading ? (
        <Loader />
      ) : (
        <Section>
          <ItemTitle>
            Recent Activity{" "}
            <TextButton onClick={() => navigate("/rules")}>View All</TextButton>
          </ItemTitle>
          <CardWrapper>
            {recentRules.length === 0 && (
              <ItemTitle fontSize="18px" smallfontSize="14px">
                No Rules Found
              </ItemTitle>
            )}
            {recentRules.map((rule) => (
              <RulesCard rule={rule} />
            ))}
          </CardWrapper>
        </Section>
      )}
    </Container>
  );
};

export default Dashboard;
