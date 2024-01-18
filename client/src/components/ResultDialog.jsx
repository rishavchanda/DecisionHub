import { CloseRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Body = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  transition: all 0.5s ease;
`;

const Container = styled.div`
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  border-radius: 8px;
  margin: 50px 20px;
  padding: 22px 28px 30px 28px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 90000;
  overflow-y: scroll;
  -ms-overflow-style: none;
  position: relative;
  outline: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 600px) {
    padding: 22px 20px 30px 20px;
  }
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0px;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  padding: 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  ${({ buttonDisabled }) =>
    buttonDisabled &&
    `
    background: #cccccc;
    color: #666666;
    cursor: not-allowed;
  `}
`;

const ResultDialog = ({ result, setResult }) => {
  const theme = useTheme();
  const fields = result?.fields;
  const data = result?.data;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && fields && data.length > 0 && fields.length > 0) {
      const tempRows = data.map((row) => {
        let tempRow = {};
        fields.forEach((field) => {
          tempRow[field] = row[field];
        });
        return tempRow;
      });
      setRows(tempRows);
    }
  }, [data, fields]);

  return (
    <Body>
      <Container theme={theme}>
        <TopBar>
          <Title>Result</Title>
          <Desc>Here is your result for the data.</Desc>
        </TopBar>
        <CloseRounded
          style={{
            position: "absolute",
            top: "16px",
            right: "26px",
            cursor: "pointer",
            fontSize: "28px",
            color: "inherit",
          }}
          onClick={() => {
            setResult({ ...result, open: false });
          }}
        />

        <TableContainer
          component={Paper}
          style={{
            backgroundColor: "transparent",
            "-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields?.map((field, index) => (
                  <TableCell key={index}>{field}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {fields?.map((field, colIndex) => (
                    <TableCell key={colIndex} component="th" scope="row">
                      {row[field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Body>
  );
};

export default ResultDialog;
