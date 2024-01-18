export const arithmeticOperations = [
  {
    name: "Add '+'",
    value: "+",
  },
  {
    name: "Subtract '-'",
    value: "-",
  },
  {
    name: "Multiply 'X'",
    value: "*",
  },
  {
    name: "Divide '/'",
    value: "/",
  },
  {
    name: "Modulus '%'",
    value: "%",
  },
];

export const comparisonOperations = [
  {
    name: "Greater than '>'",
    value: ">",
  },
  {
    name: "Less than '<'",
    value: "<",
  },
  {
    name: "Equal to '=='",
    value: "==",
  },
  {
    name: "Greater then equal to '>='",
    value: ">=",
  },
  {
    name: "Less then equal to '<='",
    value: "<=",
  },
  {
    name: "Not equal to '!='",
    value: "!=",
  },
];

export const specialFunctions = [
  {
    name: "Date_Difference",
    value: "date_diff",
  },
  {
    name: "Time_Difference",
    value: "time_diff",
  },
];

export const dateUnits = [
  {
    name: "Days",
    value: "days",
  },
  {
    name: "Months",
    value: "months",
  },
  {
    name: "Years",
    value: "years",
  },
];

export const timeUnits = [
  {
    name: "Seconds",
    value: "seconds",
  },
  {
    name: "Minutes",
    value: "minutes",
  },
  {
    name: "Hours",
    value: "hours",
  },
];

export const specialAttributes = [
  {
    name: "Current_Date",
    value: "current_date",
  },
  {
    name: "Current_Time",
    value: "current_time",
  },
];

export const logicalOperations = [
  {
    name: "AND",
    value: "&&",
  },
  {
    name: "OR",
    value: "||",
  },
];

export const checkConditionType = [
  {
    name: "Any",
    value: "Any",
  },
  {
    name: "All",
    value: "All",
  },
];

export const dummyPrompt = `
Example prompt:\n
-If the CIBIL score is over 750: 
  -If the loan duration is less than 5, lend at 13% interest. 
  -If the duration is between 5 and 10, lend at 11% interest Otherwise, lend at 9% interest. 
  -If the CIBIL score is below 750, follow other rules.
`;
