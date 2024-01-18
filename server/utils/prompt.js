export const createRuleRequest = (condition, rule) => {
  const prompt = `HOW TO BUILD THE RULE:
    you will have to generate a rule using this information about input attributes and output attributes and a text input where the conditions will be specified. the rule you will generate will be of this format
    {
        "title": "demo rule",
      "description": "demo",
      "inputAttributes": ["a", "b"],
      "outputAttributes": ["c"],
      "condition": {
            "nodes": [
                {
                    "width": 406,
                    "height": 188,
                    "id": "9",
                    "type": "outputNode",
                    "data": {
                        "label": provide a suitable label,
                        "inputAttributes":  ["a", "b"],
                        "outputAttributes": [
                            "c"
                        ],
                        "outputFields": [
                            {
                                "field": "c",
                                "value": "9"
                            }
                        ]
                    },
                    "position": {
                        "x": -1215.6890993257136,
                        "y": 2251.2520005223014
                    },
                    "selected": false,
                    "positionAbsolute": {
                        "x": -1215.6890993257136,
                        "y": 2251.2520005223014
                    },
                    "dragging": false
                },
             {
                    "width": 1069,
                    "height": 382,
                    "id": "3",
                    "type": "conditionalNode",
                    "data": {
                        "label": provide a suitable label,
                        "inputAttributes":  ["a", "b"],
                        "outputAttributes": [
                            "c"
                        ],
                        "rule": "All",
                        "conditions": [
{
    multiple: false,
    expression: 
    {
      lhs: [{
        op1:  'a',
        operator: null,
        op2: null
      }],
      comparator: '==',
      rhs: [
      {
        op1:  '2',
        operator: null,
        op2: null,
      }
      ]
    },
    boolean: "&&",
  },{
    multiple: false,
    expression: 
    {
      lhs: [{
        op1:  'c',
        operator: '/',
        op2: '2'
      }],
      comparator: '>',
      rhs: [
      {
        op1:  'd',
        operator: '/',
        op2: '4',
      },
      {
        op1:  null,
        operator: '+',
        op2: '12',
      },
      {
        op1:  null,
        operator: '/',
        op2: '2',
      }
      ]
    }
  }]
                    },
                    "position": {
                        "x": 89.64423400761984,
                        "y": 1014.2520005223013
                    },
                    "selected": true,
                    "positionAbsolute": {
                        "x": 89.64423400761984,
                        "y": 1014.2520005223013
                    },
                    "dragging": false
                },
             {
                    "width": 500,
                    "height": 276,
                    "id": "1",
                    "type": "attributeNode",
                    "data": {
                        "label": provide a suitable label,
                        "description": provide a suitable description,
                        "inputAttributes": [
                            "a", "b"
                        ],
                        "outputAttributes": [
                            "c"
                        ]
                    },
                    "position": {
                        "x": 260,
                        "y": 50
                    },
                    "selected": false,
                    "dragging": false,
                    "positionAbsolute": {
                        "x": 260,
                        "y": 50
                    }
                }]
         "edges": [
                    {
                    "id": "3-yes-5",
                    "source": "3",
                    "target": "5",
                    "animated": false,
                    "sourceHandle": "yes",
                    "style": {
                        "strokeWidth": 3
                    },
                    "markerEnd": {
                        "type": "arrowclosed",
                        "width": 12,
                        "height": 12
                    }
                }
           ]
    }
    
    if the node is the starting node with id 1 the type will be attributeNode, for condition node the type will be conditionalNode and for output node the type will be outputNode. 
    if the condition node id is 2 and the condition result is true leading to node with id 3, the corresponding edge.id will be 2-yes-3. The edge.source will be 2 and the edge.target will be 3.
    
    apart from the id, source and target each edge will have other properties. each edge should be in the following format
    
    {
       "id": "2-yes-3",
       "source": "2",
       "target": "3",
       "animated": false,
       "sourceHandle": "yes",
       "style": {
                   "strokeWidth": 3
                },
       "markerEnd": {
                      "type": "arrowclosed",
                      "width": 12,
                      "height": 12
                    }
    },
    
    the edge that connects the attribute node with id 1 with the first condition node (say id 2) will have the following format:
    {
       "id": "1-start-2",
       "source": "1",
       "target": "2",
       "animated": false,
       "sourceHandle": "yes",
       "style": {
                   "strokeWidth": 3
                },
       "markerEnd": {
                      "type": "arrowclosed",
                      "width": 12,
                      "height": 12
                    }
    },
    
    INPUT PROMPT:
    
    ${condition}
    
    INITIAL RULE:

    ${rule}
    
    This is the initial rule with input and output attributes
    Generate the corresponding complete rule with all conditional nodes and output nodes for the same
    
    generate only the valid json output. no text before the json no text after the json. i just want the json output.`;

  return prompt;
};
