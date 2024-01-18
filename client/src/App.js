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
import RulesDetails from "./pages/RulesDetails";
import TestDetails from "./pages/TestDetails";
import { ReactFlowProvider } from "reactflow";
import ToastMessage from "./components/ToastMessage";
import Profile from "./pages/Profile";

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
  });

  // set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <ReactFlowProvider>
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
                  <Route
                    path="/rules"
                    exact
                    element={<Rules setOpenNewRule={setOpenNewRule} />}
                  />
                  <Route path="/rules/:id" exact element={<RulesDetails />} />
                  <Route path="/test" exact element={<Test />} />
                  <Route path="/test/:id" exact element={<TestDetails />} />
                  <Route path="/profile" exact element={<Profile />} />
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

          {open && (
            <ToastMessage open={open} message={message} severity={severity} />
          )}
        </BrowserRouter>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
