import { CloseRounded } from "@mui/icons-material";
import {
  Checkbox,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import TextInput from "../Inputs/TextInput";
import { createRule, getTableNames, updateRule } from "../../api";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import { ruleReload } from "../../redux/reducers/rulesSlice";

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
  max-width: 500px;
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
  overflow-y: scroll;
  -ms-overflow-style: none;
  position: relative;
  outline: none;
  ::-webkit-scrollbar {
    height: 2px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 12px 0px;
  gap: 14px;
`;

const Label = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  padding: 0px 4px;
  text-transform: uppercase;
  ${({ error, theme }) =>
    error &&
    `
    color: ${theme.red};
  `}
  ${({ small }) =>
    small &&
    `
    font-size: 8px;
  `}
  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  `}
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

const NewRuleForm = ({ setOpenNewRule, updateForm }) => {
  console.log(updateForm.data);
  const navigate = useNavigate();
  const location = useLocation();
  const dispath = useDispatch();
  const theme = useTheme();
  let path = location.pathname.split("/");
  const getFlowData = (label, description) => {
    return {
      nodes: [
        {
          id: "1",
          type: "attributeNode",
          data: {
            label: label,
            description: description,
          },
          position: { x: 234, y: 50 },
        },
      ],
      edges: [],
    };
  };
  const [tables, setTables] = useState([]);
  const [ruleData, setRuleData] = useState(
    updateForm.update
      ? updateForm.data
      : {
          title: "",
          description: "",
          tables: [],
          inputAttributes: [],
          outputAttributes: [],
          condition: JSON.stringify(getFlowData("", "")),
        }
  );
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const tablesList = async () => {
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    await getTableNames(token)
      .then((res) => {
        setTables(res.data);
      })
      .catch((err) => {
        dispath(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };

  useEffect(() => {
    tablesList();
  }, []);

  useEffect(() => {
    // Clear inputAttributes when tables are unselected
    if (ruleData?.tables?.length === 0) {
      setRuleData({ ...ruleData, inputAttributes: [] });
      return;
    }

    // Collect inputAttributes from selected tables
    const selectedInputAttributes = ruleData?.tables?.reduce(
      (acc, selectedTable) => {
        const tableData = tables.find(
          (table) => table?.table === selectedTable
        );
        if (tableData) {
          acc.push(...tableData.columns);
        }
        return acc;
      },
      []
    );

    setRuleData({ ...ruleData, inputAttributes: selectedInputAttributes });
  }, [ruleData?.tables, tables]);

  const handelInputs = (e) => {
    const { name, value } = e.target;
    setRuleData({ ...ruleData, [name]: value });
  };

  const handelChipableInputs = (e) => {
    const { name, value } = e.target;
    // when user press enter or comma then add the value to the array and clear the input
    if (e.nativeEvent.data === ",") {
      setRuleData({
        ...ruleData,
        [name]: [...ruleData[name], value.slice(0, -1)],
      });
      e.target.value = "";
    }
  };

  const removeChip = (name, index) => {
    const temp = [...ruleData[name]];
    temp.splice(index, 1);
    setRuleData({ ...ruleData, [name]: temp });
  };

  useEffect(() => {
    if (
      ruleData?.title !== "" &&
      ruleData?.description !== "" &&
      ruleData?.inputAttributes?.length !== 0 &&
      ruleData?.outputAttributes?.length !== 0 &&
      ruleData?.tables?.length !== 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [ruleData]);

  const handelFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonDisabled(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    if (updateForm.update) {
      const token = localStorage.getItem("decisionhub-token-auth-x4");
      await updateRule(path[2], ruleData, token)
        .then((res) => {
          dispath(ruleReload());
          setLoading(false);
          setOpenNewRule(false);
          setButtonDisabled(false);
        })
        .catch((err) => {
          dispath(
            openSnackbar({
              message: err.response.data.message,
              severity: "error",
            })
          );
          setLoading(false);
          setButtonDisabled(false);
        });
    } else {
      console.log(ruleData);
      ruleData.condition = JSON.stringify(
        getFlowData(ruleData.title, ruleData.description)
      );
      await createRule(ruleData, token)
        .then((res) => {
          navigate(`/rules/${res.data.id}`);
          setLoading(false);
          setOpenNewRule(false);
          setButtonDisabled(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setOpenNewRule(false);
          setButtonDisabled(false);
        });
    }
  };

  return (
    <Body>
      <Modal
        open
        onClose={() => {
          setOpenNewRule(false);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container>
          <TopBar>
            <Title>
              {updateForm.update ? "Update Rule" : "Create New Rule"}
            </Title>
            <Desc>Add all rule details</Desc>
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
            onClick={() => setOpenNewRule(false)}
          />
          <Form>
            <TextInput
              label="Rule Title"
              placeholder="Enter rule title"
              name="title"
              value={ruleData.title}
              handelChange={handelInputs}
            />
            <TextInput
              label="Rule Description"
              placeholder="Enter rule description"
              name="description"
              textArea
              rows={3}
              value={ruleData.description}
              handelChange={handelInputs}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <Label>Select Table</Label>
              <Select
                multiple
                displayEmpty
                value={ruleData?.tables}
                onChange={(e) => {
                  let selectedTables = e.target.value;
                  setRuleData({
                    ...ruleData,
                    tables: selectedTables,
                  });
                }}
                autoWidth
                sx={{
                  color: theme.text_primary,
                  border: `1px solid ${theme.text_secondary + 90}`,
                  borderRadius: "8px",
                  padding: "0px",
                  fontSize: "12px",
                  ".MuiSvgIcon-root ": {
                    fill: `${theme.text_secondary} !important`,
                  },
                }}
              >
                <MenuItem disabled>Select database Table</MenuItem>
                {tables.map((table) => (
                  <MenuItem key={table?.table} value={table?.table}>
                    <Checkbox
                      checked={ruleData?.tables.includes(table?.table)}
                      sx={{ padding: "0px", marginRight: "4px" }}
                    />
                    {`Table Name: ${table?.table}`}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <TextInput
              label="Input Attributes"
              placeholder="Enter input attributes"
              name="inputAttributes"
              height="60px"
              chipableInput
              chipableArray={ruleData.inputAttributes}
              handelChange={handelChipableInputs}
              removeChip={removeChip}
            />
            <TextInput
              label="Output Attributes"
              placeholder="Enter output attributes"
              name="outputAttributes"
              height="60px"
              chipableInput
              chipableArray={ruleData.outputAttributes}
              handelChange={handelChipableInputs}
              removeChip={removeChip}
            />
          </Form>
          <Button
            onClick={(e) => {
              handelFormSubmit(e);
            }}
            buttonDisabled={buttonDisabled}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>{updateForm.update ? "Update" : "Continue"}</>
            )}
          </Button>
        </Container>
      </Modal>
    </Body>
  );
};

export default NewRuleForm;
