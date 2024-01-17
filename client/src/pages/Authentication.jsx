import { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import BG from "../images/auth-bg.png";
// import SignUp from "../components/SignUp";
// import Logo from "../Images/Logo.svg";

const Container = styled.div`
  padding: 20px 150px;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 6px 0px;
  }
  // background: ${({ theme }) => theme.bg};
  background: url(${BG});
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

// const LogoImg = styled.img`
//   height: 36px;
//   margin-right: 10px;
//   @media only screen and (max-width: 600px) {
//     height: 30px;
//   }
// `;

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
