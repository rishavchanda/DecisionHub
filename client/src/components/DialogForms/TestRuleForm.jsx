/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import styled, { useTheme } from "styled-components";
import TextInput from "../Inputs/TextInput";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  min-width: 350px;
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
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.popup_text_primary};
`;

const Desc = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: ${({ theme }) => theme.popup_text_secondary};
  margin: 0px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  padding: 6px 0px;
  gap: 10px;
`;

const Hr = styled.div`
  width: 80%;
  height: 1px;
  margin: 15px 0px 15px 0px;
  background: ${({ theme }) => theme.menu_secondary_text + 30};
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const TestRuleForm = ({
  attributes,
  loading,
  submitTestData,
  excelLoading,
  dbLoading,
  submitExcelData,
  output,
}) => {
  const theme = useTheme();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [testData, setTestData] = useState(
    Object.fromEntries(attributes.map((attribute) => [attribute, ""]))
  );

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

  // Check if all inputs are filled
  const checkInputs = () => {
    for (const [key, value] of Object.entries(testData)) {
      if (value === "") return false;
    }
    return true;
  };

  useEffect(() => {
    setButtonDisabled(!checkInputs());
  }, [checkInputs, testData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // You can perform additional checks on the file if needed
    // For example, check the file type or size

    // Pass the file to the submitExcelData function
    submitExcelData(file);
  };

  return (
    <div>
      <Button onClick={handleClick}>Test with inputs</Button>
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
            <Title>Test Rule with values</Title>
            <Desc>Enter all values for rule input's</Desc>
          </TopBar>
          <Form>
            {attributes?.map((attribute, index) => {
              return (
                <TextInput
                  small
                  popup
                  key={index}
                  label={attribute}
                  name={attribute}
                  value={testData[attribute]}
                  handelChange={(e) =>
                    setTestData({
                      ...testData,
                      [attribute]: e.target.value,
                    })
                  }
                />
              );
            })}
          </Form>
          {output.length > 0 && (
            <div>
              <Title style={{ fontSize: "14px" }}>Output</Title>
              {output.map((item, index) => (
                <Desc
                  style={{ fontSize: "12px", fontWeight: "400" }}
                  key={index}
                >
                  {item?.field} : {item?.value}
                </Desc>
              ))}
            </div>
          )}
          <Button
            onClick={() =>
              !buttonDisabled && !loading && submitTestData(testData)
            }
            disabled={buttonDisabled || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={18} color="inherit" />
              </>
            ) : (
              "Submit"
            )}
          </Button>

          <Flex>
            <Hr />
            Or
            <Hr />
          </Flex>
          <label htmlFor="excelFile">
            <Button
              as="div"
              style={{
                backgroundColor: theme.secondary,
                color: theme.white,
              }}
            >
              {excelLoading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                </>
              ) : (
                "Upload Excel Sheet"
              )}
            </Button>
          </label>
          <input
            id="excelFile"
            type="file"
            accept=".xlsx, .xls" // Specify accepted file types if needed
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
            }}
          >
            {dbLoading ? (
              <>
                <CircularProgress size={18} color="inherit" />
              </>
            ) : (
              "Run On Database"
            )}
          </Button>
        </Container>
      </Popover>
    </div>
  );
};

export default TestRuleForm;
