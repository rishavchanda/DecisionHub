import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Avatar, CircularProgress, IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { CloseRounded, MenuRounded, SearchRounded } from "@mui/icons-material";
import { useSelector } from "react-redux";
import SearchItemCard from "./cards/SearchItemCard";
import { searchRule } from "../api";
// import UserProfile from "./Profile";
// import Logo from "../Images/Logo.svg";

const Container = styled.div`
  flex: 1;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Path = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const Search = styled.div`
  flex: 1;
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
  border: none;
  font-size: 15px;
  padding: 14px 22px;
  border-radius: 100px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 400px) {
    max-width: 130px;
  }
`;

const Searched = styled.div`
  position: absolute;
  flex: 1;
  z-index: 1000;
  width: 32%;
  min-width: 250px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  background: ${({ theme }) => theme.bg};
  box-shadow: 1px 1px 10px 2px ${({ theme }) => theme.black + 20};
  transition: all 0.3s ease;
  @media (max-width: 400px) {
    min-width: 200px;
  }
`;
const Hr = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.text_secondary + 10};
`;

const User = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0px 8px;
  display: flex;
  cursor: pointer;
`;

const Navbar = ({ setMenuOpen, menuOpen }) => {
  // Hooks
  const theme = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const location = useLocation();

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

  // handle search
  const hadelSearch = async (value) => {
    setOpenSearch(true);
    setLoading(true);
    const token = localStorage.getItem("decisionhub-token-auth-x4");
    setSearch(value);
    await searchRule(value, token)
      .then((res) => {
        setSearchResult(res.data);
        console.log(value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (search.length === 0) {
      setOpenSearch(false);
      setSearchResult([]);
    }
  }, [search]);

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
      <div
        style={{
          flex: 1,
        }}
      >
        <Search>
          <Input
            placeholder="Search any rule..."
            value={search}
            onChange={(e) => hadelSearch(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0px",
            }}
          >
            {search.length > 0 && (
              <CloseRounded
                onClick={() => setSearch("")}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  borderRadius: "50%",
                  background: theme.navbar,
                  color: theme.menu_primary_text,
                  width: "12px",
                  height: "12px",
                }}
              />
            )}
            <SearchRounded
              style={{ marginRight: "14px", marginLeft: "14px" }}
              sx={{ fontSize: "20px" }}
            />
          </div>
        </Search>
        {openSearch && (
          <Searched>
            {loading ? (
              <div style={{ padding: "20px" }}>
                <CircularProgress style={{ width: "30px", height: "30px" }} />
              </div>
            ) : (
              <>
                {searchResult.length > 0 ? (
                  searchResult.map((item) => (
                    <>
                      <SearchItemCard
                        key={item.id}
                        item={item}
                        setOpenSearch={setOpenSearch}
                        setSearch={setSearch}
                      />
                      {searchResult.indexOf(item) !==
                        searchResult.length - 1 && <Hr />}
                    </>
                  ))
                ) : (
                  <div style={{ padding: "20px" }}>No results found</div>
                )}
              </>
            )}
          </Searched>
        )}
      </div>
      <User>
        <Avatar
          src={currentUser?.img}
          style={{
            fontSize: "12px",
            background: generateColor(currentUser?.name),
          }}
        >
          {currentUser?.name[0]}
        </Avatar>
      </User>
    </Container>
  );
};

export default Navbar;
