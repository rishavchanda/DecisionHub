import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Rules from "./pages/Rules";
import Test from "./pages/Test";
import { logout, setDarkMode } from "./redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Authentication from "./pages/Authentication";
import NewRuleForm from "./components/DialogForms/NewRuleForm";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 3;
`;

function App() {
  const { currentUser, darkMode } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [menuOpen, setMenuOpen] = useState(true);
  const [openNewRule, setOpenNewRule] = useState(false);

  const dispatch = useDispatch();

  // set default light mode
  useEffect(() => {
    if (darkMode === undefined) {
      dispatch(setDarkMode(false));
    }
    console.log(currentUser);
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            {menuOpen && <Sidebar setMenuOpen={setMenuOpen} />}
            <Wrapper>
              <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

              <Routes>
                <Route
                  path="/"
                  exact
                  element={<Dashboard setOpenNewRule={setOpenNewRule} />}
                />
                <Route path="/rules" exact element={<Rules />} />
                <Route path="/test" exact element={<Test />} />
              </Routes>
              {openNewRule && (
                <NewRuleForm
                  setOpenNewRule={setOpenNewRule}
                  updateForm={{ update: false }}
                />
              )}
            </Wrapper>
          </Container>
        ) : (
          <Authentication />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
