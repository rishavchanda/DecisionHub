import { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
// import SignUp from "../components/SignUp";
// import Logo from "../Images/Logo.svg";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 50px;
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logotext = styled.div`
  font-size: 38px;
  font-weight: bold;
  display: flex;
  align-items: center;
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

const LogoImg = styled.img`
  height: 36px;
  margin-right: 10px;
  @media only screen and (max-width: 600px) {
    height: 30px;
  }
`;

const WelcomeText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 36px;
  color: ${({ theme }) => theme.text_primary + 80};
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const Authentication = () => {
  const [openSignUp, setOpenSignUp] = useState(false);
  return (
    <Container>
      <Wrapper>
        <Logotext>
          {/* <LogoImg src={Logo} /> */}
          DecisionHub
        </Logotext>
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
    </Container>
  );
};

export default Authentication;
