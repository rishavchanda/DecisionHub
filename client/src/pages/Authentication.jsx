import { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import BG from "../images/BG.png";
import ReactFlow, { Background, Panel } from "reactflow";
import { dummyRuleEdges, dummyRuleNodes } from "../utils/data";
import AttributeNode from "../components/Nodes/ArrtibuteNode";
import ConditionalNode from "../components/Nodes/ConditionalNode";
import OutputNode from "../components/Nodes/OutputNode";

const OuterContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const Container = styled.div`
  padding: 0px 150px;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 6px 0px;
  }
  background: url(${BG});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  overflow-y: scroll;
  align-items: center;
`;

const Wrapper = styled.div`
  display: inline-block;
  width: 400px;
  text-align: center;
`;

const Logotext = styled.div`
  font-size: 38px;
  font-weight: bold;
  display: inline;
  margin-left: 50px;
  text-transform: uppercase;
  background: linear-gradient(
    225deg,
    rgb(132, 0, 255) 0%,
    rgb(230, 0, 255) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 4px;
  @media only screen and (max-width: 600px) {
    font-size: 34px;
  }
`;

const WelcomeText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-left: 50px;
  margin-bottom: 36px;
  color: ${({ theme }) => theme.text_primary + 80};
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const nodeTypes = {
  attributeNode: AttributeNode,
  conditionalNode: ConditionalNode,
  outputNode: OutputNode,
};

const Authentication = () => {
  const [openSignUp, setOpenSignUp] = useState(false);
  return (
    <OuterContainer>
      <Container>
        <ReactFlow
          nodeTypes={nodeTypes}
          fitView={true}
          nodes={dummyRuleNodes}
          edges={dummyRuleEdges}
        >
          <Background />
          <Panel position="left">
            <Wrapper>
              <Logotext>DecisionHub</Logotext>
              <WelcomeText>
                {openSignUp
                  ? "Welcome to DecisionHub!"
                  : "Welcome back to DecisionHub!"}
              </WelcomeText>
              {openSignUp ? (
                <SignUp setOpenSignUp={setOpenSignUp} />
              ) : (
                <SignIn setOpenSignUp={setOpenSignUp} />
              )}
            </Wrapper>
          </Panel>
        </ReactFlow>
      </Container>
    </OuterContainer>
  );
};

export default Authentication;
