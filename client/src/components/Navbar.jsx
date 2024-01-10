import { useState } from "react";
import styled from "styled-components";
import { Avatar, IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { MenuRounded, SearchRounded } from "@mui/icons-material";
import DropdownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";
// import UserProfile from "./Profile";
// import Logo from "../Images/Logo.svg";

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.navbar};
  color: ${({ theme }) => theme.menu_primary_text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  @media only screen and (max-width: 600px) {
    padding: 10px 12px;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  @media only screen and (max-width: 600px) {
    gap: 8px;
  }
`;

const MenuIcon = styled(IconButton)`
  color: ${({ theme }) => theme.text_primary} !important;
  display: none !important;
  @media (max-width: 1100px) {
    display: flex !important;
  }
`;

const LogoText = styled(Link)`
  @media (max-width: 1100px) {
    display: flex;
    font-size: 20px;
  }
  display: none;
  font-weight: bold;
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
  font-size: 24px;
`;

const LogoImg = styled.img`
  display: none;
  height: 22px;
  margin-right: 10px;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const Path = styled.div`
  font-size: 20px;
  font-weight: 600;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const Search = styled.div`
  width: 40%;
  @media screen and (max-width: 480px) {
    width: 50%;
  }
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bg};
`;
const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 15px;
  padding: 14px 22px;
  border-radius: 100px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_primary};
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0px 8px;
  display: flex;
  cursor: pointer;
`;

const UserName = styled.span`
  font-weight: 500;
  margin-right: 10px;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Navbar = ({ setMenuOpen, menuOpen }) => {
  // Hooks
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Open the account dialog
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Functions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  // get the main path from the location
  let path = location.pathname.split("/")[1];
  if (path === "") path = "Dashboard";
  else if (path === "rules") path = "Rules";
  else if (path === "test") path = "Debug / Test Rules";
  else if (path === "profile") path = "Profile";
  else path = "";

  return (
    <Container>
      <Flex>
        <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          <MenuRounded sx={{ fontSize: "30px" }} />
        </MenuIcon>
        <Path>{path}</Path>
        <LogoText to="/">
          {/* <LogoImg src={Logo} /> */}
          DecisionHub
        </LogoText>
      </Flex>
      <Search>
        <Input placeholder="Search any rule..." />
        <SearchRounded
          style={{ marginRight: "14px", marginLeft: "14px" }}
          sx={{ fontSize: "20px" }}
        />
      </Search>
      <User aria-describedby={id} onClick={handleClick}>
        <Avatar
          src={currentUser?.img}
          style={{
            fontSize: "12px",
            background: generateColor(currentUser?.name),
          }}
        >
          {currentUser?.name[0]}
        </Avatar>
        <DropdownIcon />
      </User>
      {/* {currentUser && (
        <UserProfile
          open={open}
          anchorEl={anchorEl}
          id={id}
          handleClose={handleClose}
        />
      )} */}
    </Container>
  );
};

export default Navbar;
