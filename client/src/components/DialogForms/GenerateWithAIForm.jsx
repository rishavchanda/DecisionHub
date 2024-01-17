/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import styled, { useTheme } from "styled-components";
import TextInput from "../Inputs/TextInput";
import { CircularProgress } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { dummyPrompt } from "../../utils/data";

const Container = styled.div`
  max-width: 350px;
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.popup};
  color: ${({ theme }) => theme.popup_text_secondary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  outline: none;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const TopBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.popup_text_primary};
`;

const Info = styled.div`
  font-size: 10px;
  font-weight: 200;
  color: ${({ theme }) => theme.popup_text_secondary};
  margin-top: 4px;
`;

const Desc = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: ${({ theme }) => theme.popup_text_secondary};
`;

const Form = styled.form`
  flex: 1;
  padding: 6px 0px;
  gap: 10px;
`;

const Button = styled.div`
  border-radius: 6px;
  padding: 8px 14px;
  margin: 6px 0px;
  font-size: 12px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.secondary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  ${({ disabled, theme }) =>
    disabled &&
    `
    background-color: ${theme.secondary + 50};
    cursor: not-allowed;
  `}
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

const GenerateWithAIForm = ({ loading, submitPrompt }) => {
  const theme = useTheme();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [prompt, setPrompt] = useState("");

  // Popup
  const [anchorEl, setAnchorEl] = useState();
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    setButtonDisabled(prompt === "");
  }, [prompt]);

  return (
    <div>
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
        onClick={handleClick}
      >
        <AutoAwesome sx={{ fontSize: "18px", color: theme.green }} />
        Generate Rule with AI
      </OutlineWrapper>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Container>
          <TopBar>
            <Title>Generate a rule with AI</Title>
            <Desc>
              Enter rule prompt ant it will generate a rule based on that
            </Desc>
            <Info>
              The rule will be generated based on the prompt you enter. There
              might be some errors in the generated rule. Please check the rule
              before saving it.
            </Info>
          </TopBar>
          <Form>
            <TextInput
              small
              popup
              label="Rule Prompt"
              name="prompt"
              value={prompt}
              placeholder={dummyPrompt}
              handelChange={(e) => setPrompt(e.target.value)}
              textArea={true}
              rows={12}
              sx={{
                width: "100%",
              }}
            />
          </Form>
          <Button
            onClick={() => !buttonDisabled && !loading && submitPrompt(prompt)}
            disabled={buttonDisabled || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={18} color="inherit" />
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </Container>
      </Popover>
    </div>
  );
};

export default GenerateWithAIForm;
