import React, { useEffect, useState } from "react";
import "reactflow/dist/style.css";
import styled, { useTheme } from "styled-components";
import { useDispatch } from "react-redux";
import { getRules } from "../api";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import RulesCard from "../components/cards/RulesCard";
import Loader from "../components/Loader";
import { AddRounded } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 0px;
  }
  background: ${({ theme }) => theme.bg};
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
`;

const ItemTitle = styled.div`
  display: flex;
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

const Rules = ({ setOpenNewRule }) => {
  // Hooks
  const theme = useTheme();
  const dispath = useDispatch();
  const [filter, setFilter] = useState("updatedAt");
  const [recentRules, setRecentRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecentRules = async () => {
    setLoading(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await getRules(filter, token)
      .then((res) => {
        setRecentRules(res.data);
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
    getRecentRules();
  }, [filter]);

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Flex>
            <ItemTitle>All Rules</ItemTitle>
            <TopSection>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoWidth
                displayEmpty
                size="small"
                sx={{
                  color: theme.text_primary,
                  border: `1px solid ${theme.text_secondary + 90}`,
                  borderRadius: "8px",
                  padding: "4px",
                  fontSize: "12px",
                  ".MuiSvgIcon-root ": {
                    fill: `${theme.text_secondary} !important`,
                  },
                }}
              >
                <MenuItem value="updatedAt">Sort: Recent Updated</MenuItem>
                <MenuItem value="createdAt">Sort: Recent Created</MenuItem>
              </Select>
              <Button onClick={() => setOpenNewRule(true)}>
                <AddRounded sx={{ fontSize: "22px" }} />
                Create New Rule
              </Button>
            </TopSection>
          </Flex>
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
        </>
      )}
    </Container>
  );
};

export default Rules;
