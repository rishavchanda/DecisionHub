import {
  AddRounded,
  DeleteOutlineRounded,
  DragIndicator,
} from "@mui/icons-material";
import React from "react";
import styled, { useTheme } from "styled-components";

const Wrapper = styled.div`
  width: fit-content;
`;

const Condition = styled.div`
  draggable: true;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
`;

const VR = styled.div`
  width: 0.5px;
  height: 100%;
  background: ${({ theme }) => theme.text_secondary + 50};
`;

const ConditionBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const OutlineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 9px 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  background: transparent;
  border: none;
  padding-right: 2px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.card};
  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  max-width: 100px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.card};
  &:focus {
    outline: none;
  }
`;

const Button = styled.div`
  width: max-content;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
  ${({ booleanDisabled }) =>
    booleanDisabled &&
    `
    cursor: not-allowed;
  `}
`;

const Conditions = ({
  withBoolean,
  booleanDisabled,
  condition,
  inputAttribute,
}) => {
  const theme = useTheme();
  return (
    <Wrapper>
      <Condition>
        <DragIndicator
          sx={{
            fontSize: "22px",
            color: theme.text_secondary,
            cursor: "pointer",
          }}
        />
        <VR />
        {condition.expression?.map((item) => (
          <>
            <ConditionBody>
              {item.inputAttribute && (
                <OutlineWrapper>
                  <Select value={item.inputAttribute}>
                    {inputAttribute.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </Select>
                </OutlineWrapper>
              )}
              <OutlineWrapper>
                <Select value={item.operator}>
                  <option value="Add">Add '+'</option>
                  <option value="Subtract">Subtract '-'</option>
                  <option value="Multiply">Multiply '*'</option>
                  <option value="Divide">Divide '/'</option>
                  <option value="Modulus">Modulus '%'</option>
                  <option value="Greater than">Greater than '{">"}'</option>
                  <option value="Less than">Less than '{">"}'</option>
                  <option value="Equal to">Equal to '=='</option>
                  <option value="Greater then equal to">
                    Greater then '{">="}'
                  </option>
                  <option value="Less then equal to">Less then '{">="}'</option>

                  <option value="Not equal to">Not equal to '{"=!"}'</option>
                </Select>
              </OutlineWrapper>
              <OutlineWrapper>
                {inputAttribute.includes(item.value) ? (
                  <Select value={item.value}>
                    {inputAttribute.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </Select>
                ) : (
                  <Input value={item.value} />
                )}
              </OutlineWrapper>
            </ConditionBody>
            <VR />
          </>
        ))}
        <Button>
          <AddRounded sx={{ fontSize: "18px", color: theme.primary }} />
          Add Expression
        </Button>
        <VR />
        <DeleteOutlineRounded
          sx={{
            fontSize: "20px",
            color: theme.text_secondary,
            cursor: "pointer",
          }}
        />
      </Condition>
      {!withBoolean && (
        <>
          <VR style={{ height: "10px", margin: "0px 20px", width: "2px" }} />
          <Button
            style={{ width: "fit-content", fontSize: "12px" }}
            booleanDisabled={booleanDisabled}
          >
            <AddRounded sx={{ fontSize: "16px", color: theme.primary }} />
            Add Boolean Condition
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default Conditions;
