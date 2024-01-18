import {
  AccountTreeRounded,
  CloseRounded,
  DarkModeRounded,
  DashboardRounded,
  LightModeRounded,
  LogoutRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
  RuleRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { logout, setDarkMode } from "../redux/reducers/userSlice";
import Logo from "../images/logo.png";

const Container = styled.div`
  ${({ collapsed }) =>
    collapsed
      ? `
  flex: 0.1;

`
      : `
  flex: 0.60;
`}
  max-width: 250px;
  flex-direction: column;
  height: 100vh;
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.menubar};
  color: ${({ theme }) => theme.menu_secondary_text};
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 1000;
    width: 100%;
    ${({ collapsed }) =>
      collapsed
        ? `
    max-width: 70px;

`
        : `
    max-width: 280px;
`}
    left: ${({ setMenuOpen }) => (setMenuOpen ? "0" : "-100%")};
    transition: 0.3s ease-in-out;
  }
`;
const ContainerWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
`;
const FlexTopDown = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LogoText = styled(Link)`
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
  background: linear-gradient(
    225deg,
    rgb(132, 0, 255) 0%,
    rgb(230, 0, 255) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  @media only screen and (max-width: 600px) {
    font-size: 22px;
  }
`;

const Colapse = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.menu_secondary_text + 20};
  color: ${({ theme }) => theme.menu_secondary_text};
  padding: 2px;
  margin-left: 10px;
`;

const LogoImg = styled.img`
  height: 25px;
  margin-right: 10px;
  @media only screen and (max-width: 600px) {
    height: 22px;
  }
`;

const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const NavLinkItem = styled(NavLink)`
  display: flex;
  color: ${({ theme }) => theme.menu_secondary_text};
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 6px;
  transition: 0.3s ease-in-out;
  margin: 0px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.primary + 10};
  }
  &.active {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.menu_primary_text} !important;
    font-weight: 500;
  }
`;

const Item = styled.div`
  display: flex;
  color: ${({ theme }) => theme.menu_secondary_text};
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 6px;
  transition: 0.3s ease-in-out;
  margin: 0px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.menu_secondary_text + 10};
  }
`;

const Hr = styled.div`
  height: 1px;
  margin: 15px 0px 15px 0px;
  background: ${({ theme }) => theme.menu_secondary_text + 30};
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.menu_primary_text + 90};
  margin-bottom: 12px;
  padding: 0px 26px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  color: ${({ theme }) => theme.menu_primary_text};
`;

const Span = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.menu_secondary_text};
`;

const Sidebar = ({ setMenuOpen }) => {
  // Hooks
  const { darkMode } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Functions
  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  // create a color code based on user name
  const generateColor = (name) => {
    const nameHash = name
      .toLowerCase()
      .split("")
      .reduce((hash, char) => {
        const charCode = char.charCodeAt(0);
        return (((hash % 65536) * 65536) % 2147483648) + charCode;
      }, 0);

    const hue = nameHash % 360;
    const saturation = 75; // Random value between 25 and 100
    const lightness = 40; // Random value between 20 and 80

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    if (window.innerWidth < 1100) {
      setCollapsed(true);
    }
  }, []);

  return (
    <Container setMenuOpen={setMenuOpen} collapsed={collapsed}>
      <FlexTopDown>
        <div>
          <Flex>
            <LogoText to="/">
              {!collapsed && <LogoImg src={Logo} />}
              {!collapsed && "DecisionHub"}
              <Colapse
                onClick={(e) => {
                  e.preventDefault();
                  setCollapsed(!collapsed);
                }}
              >
                {collapsed ? (
                  <NavigateNextRounded sx={{ fontSize: "16px" }} />
                ) : (
                  <NavigateBeforeRounded sx={{ fontSize: "16px" }} />
                )}
              </Colapse>
            </LogoText>
            <Close>
              <CloseRounded onClick={() => setMenuOpen(false)} />
            </Close>
          </Flex>
          <ContainerWrapper>
            <NavLinkItem
              to="/"
              index
              exact
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <DashboardRounded sx={{ fontSize: "22px" }} />
              {!collapsed && "Dashboard"}
            </NavLinkItem>
            <NavLinkItem
              to="/rules"
              index
              exact
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <AccountTreeRounded sx={{ fontSize: "22px" }} />
              {!collapsed && "Rules"}
            </NavLinkItem>
            <NavLinkItem
              to="/test"
              index
              exact
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <RuleRounded sx={{ fontSize: "22px" }} />
              {!collapsed && "Debug / Test Rules"}
            </NavLinkItem>
            <Hr />
            {!collapsed && <Title>Settings</Title>}
            <Item onClick={() => dispatch(setDarkMode(!darkMode))}>
              {darkMode ? (
                <LightModeRounded sx={{ fontSize: "22px" }} />
              ) : (
                <DarkModeRounded sx={{ fontSize: "22px" }} />
              )}
              {!collapsed && <>{darkMode ? "Light" : "Dark"} Mode</>}
            </Item>
            <Item onClick={() => logoutUser()}>
              <LogoutRounded sx={{ fontSize: "22px" }} />
              {!collapsed && <>Logout</>}
            </Item>
          </ContainerWrapper>
        </div>
        <NavLinkItem
          to="/profile"
          exact
          style={{
            textDecoration: "none",
            color: "inherit",
            borderRadius: "0px",
            margin: "15px 0px 0px 0px",
            background: theme.menu_secondary_text + 20,
            height: "48px",
          }}
        >
          <Avatar
            style={{
              height: "32px",
              width: "32px",
              fontSize: "12px",
              borderRadius: "6px",
              background: generateColor(currentUser?.name),
            }}
            src={currentUser?.img}
          >
            {currentUser && currentUser?.name[0]}
          </Avatar>
          {!collapsed && (
            <>
              <ProfileDetails>
                {currentUser?.name}
                <Span>{currentUser?.email}</Span>
              </ProfileDetails>
              <NavigateNextRounded style={{ width: "20px", height: "20px" }} />
            </>
          )}
        </NavLinkItem>
      </FlexTopDown>
    </Container>
  );
};

export default Sidebar;
