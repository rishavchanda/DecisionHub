import { useState } from "react";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import BG from "../images/Bg.png";
import DemoLight from "../images/DemoImageDark.png";
import DemoDark from "../images/DemoImageLight.png";
import { useSelector } from "react-redux";

const OuterContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
`;

const Container = styled.div`
  padding: 0px 0px 0px 100px;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 6px 0px;
  }
  display: flex;
  gap: 20px;
  overflow-y: scroll;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  flex: 1;
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  text-align: center;
  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;
const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  text-align: center;
  align-items: center;
  justify-content: flex-end;
  background: url(${BG});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Logotext = styled.div`
  width: 400px;
  font-size: 38px;
  font-weight: bold;
  display: inline;
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
  margin-bottom: 0px;
  @media only screen and (max-width: 600px) {
    font-size: 34px;
  }
`;

const WelcomeText = styled.div`
  width: 400px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text_primary + 80};
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const Image = styled.img`
  width: 140%;
`;

const Authentication = () => {
  const [openSignUp, setOpenSignUp] = useState(false);
  const { darkMode } = useSelector((state) => state.user);
  return (
    <OuterContainer>
      <Container>
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
        <RightWrapper>
          <Image src={!darkMode ? DemoDark : DemoLight} />
        </RightWrapper>
      </Container>
    </OuterContainer>
  );
};

export default Authentication;
