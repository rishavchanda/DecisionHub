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

export const ArithmeticOperations = ["+", "-", "*", "/", "%"];
export const ComparisonOperations = [">", "<", "==", ">=", "<=", "!="];
export const specialFunctionsList = ["date_diff", "time_diff"];
export const specialAttributesList = ["current_date", "current_time"];
export const DateUnits = ["days", "months", "years"];
export const TimeUnits = ["seconds", "minutes", "hours"];

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

export const dummyRuleNodes = [
  {
    width: 406,
    height: 188,
    id: "3",
    type: "outputNode",
    data: {
      label: "Output Node",
      inputAttributes: ["a", "b"],
      outputAttributes: ["c"],
      outputFields: [
        {
          field: "Result",
          value: "9",
        },
      ],
    },
    position: {
      x: 700.6890993257136,
      y: 2800.2520005223014,
    },
    selected: false,
    positionAbsolute: {
      x: -30.6890993257136,
      y: 2800.2520005223014,
    },
    dragging: false,
  },
  {
    width: 1069,
    height: 382,
    id: "2",
    type: "conditionalNode",
    data: {
      label: "Conditional Node",
      inputAttributes: ["a", "b"],
      outputAttributes: ["c"],
      rule: "All",
      conditions: [
        {
          multiple: false,
          expression: {
            lhs: [
              {
                op1: "a",
                operator: null,
                op2: null,
              },
            ],
            comparator: "==",
            rhs: [
              {
                op1: "2",
                operator: null,
                op2: null,
              },
            ],
          },
        },
      ],
    },
    position: {
      x: -100,
      y: 2200,
    },
    selected: false,
    positionAbsolute: {
      x: -100,
      y: 2200,
    },
    dragging: false,
  },
  {
    type: "attributeNode",
    id: "1",
    data: {
      label: "Attribute Node",
      inputAttributes: ["a", "b"],
      outputAttributes: ["c"],
    },
    position: {
      x: -50,
      y: 1800.2520005223014,
    },
  },
];

export const dummyRuleEdges = [
  {
    id: "e1-2",
    source: "1",
    sourceHandle: null,
    target: "2",
    targetHandle: null,
    type: "smoothstep",
    label: "a == 2",
    animated: true,
    labelStyle: {
      fill: "white",
      fontWeight: 700,
    },
    labelBgStyle: {
      fill: "#333",
      stroke: "none",
    },
  },
  {
    id: "e2-3",
    source: "2",
    sourceHandle: null,
    target: "3",
    targetHandle: null,
    type: "smoothstep",
    label: "True",
    animated: true,
    labelStyle: {
      fill: "white",
      fontWeight: 700,
    },
    labelBgStyle: {
      fill: "#333",
      stroke: "none",
    },
  },
];
