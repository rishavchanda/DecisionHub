import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  EmailRounded,
  PasswordRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import google from "../images/google.png";
// import { AdminLogin, EmployeeLogin } from "../api";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import ForgetPassword from "./ForgetPassword";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth, signIn } from "../api";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 22px 28px 40px 28px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_secondary + 99};
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  @media (max-width: 500px) {
    max-width: 320px;
    padding: 16px 16px 30px 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 18px 0px 12px 0px;
  gap: 10px;
`;
const Hr = styled.div`
  width: 100%;
  height: 1px;
  margin: 15px 0px 15px 0px;
  background: ${({ theme }) => theme.menu_secondary_text + 30};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  padding: 12px 14px;
`;

const OutlinedInput = styled.div`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: transparent;
  color: ${({ theme }) => theme.text_secondary};
  outline: none;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 600px) {
    padding: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  outline: none;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text_secondary};
  &:focus {
    outline: none;
  }
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Error = styled.p`
  font-size: 12px;
  margin: 0px 4px;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ForgotPassword = styled.p`
  font-size: 15px;
  text-align: right;
  margin-right: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: ${({ theme }) => theme.primary + 80};
  }
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  padding: 14px;
  border-radius: 10px;
  background: ${({ theme }) => theme.button};
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  ${({ buttonDisabled }) =>
    buttonDisabled &&
    `
    background: #cccccc;
    color: #666666;
    cursor: not-allowed;
  `}
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  border: 1.5px solid ${({ theme }) => theme.text_secondary + 70};
  outline: none;
  padding: 14px;
  border-radius: 10px;
  background: transparent;
  // background: ${({ theme }) => theme.bg_secondary};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Text = styled.p`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 20px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;

const SignIn = (props) => {
  const { setOpenSignUp } = props;
  // hooks
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("admin");

  // reset password
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState({
    email: "",
  }); // error message for validation checks.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // validation checks
    if (name === "email") {
      // Email validation regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        setButtonDisabled(true);
      }

      if (value && !emailRegex.test(value)) {
        setErrorMessage({
          ...errorMessage,
          email: "Enter correct email format",
        });
        setButtonDisabled(true);
      } else {
        setErrorMessage({
          ...errorMessage,
          email: "",
        });
      }
    }

    if (name === "password") {
      if (!value) {
        setButtonDisabled(true);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // If there is no error message and all the fields are filled, then enable the button
    if (!errorMessage.email && formData.email && formData.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [errorMessage, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If there is no error message, then submit the form
    if (!buttonDisabled) {
      setLoading(true);
      setButtonDisabled(true);
      signIn(formData)
        .then((res) => {
          if (res.status === 200) {
            dispatch(loginSuccess(res.data));
            dispatch(
              openSnackbar({
                message: "Login Successful",
                severity: "success",
              })
            );
            setLoading(false);
            setButtonDisabled(false);
            setErrorMessage({
              ...errorMessage,
              apierror: "",
            });
          }
        })
        .catch((err) => {
          setButtonDisabled(false);
          if (err.response) {
            setLoading(false);
            setErrorMessage({
              ...errorMessage,
              apierror: err.response.data.message,
            });
          } else {
            setLoading(false);
            dispatch(
              openSnackbar({
                message: err.message,
                severity: "error",
              })
            );
          }
        });
    }
  };

  //Google SignIn
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const user = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .catch((err) => {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });

      googleAuth({
        name: user.data.name,
        email: user.data.email,
        img: user.data.picture,
      })
        .then((res) => {
          if (res.status === 200) {
            dispatch(loginSuccess(res.data));
            dispatch(
              openSnackbar({
                message: "Logged In Successfully",
                severity: "success",
              })
            );
            setLoading(false);
          } else {
            dispatch(
              openSnackbar({
                message: res.data.message,
                severity: "error",
              })
            );
            setLoading(false);
          }
        })
        .catch((err) => {
          dispatch(
            openSnackbar({
              message: err.response.data.message,
              severity: "error",
            })
          );
          setErrorMessage({
            ...errorMessage,
            apierror: err.response.data.message,
          });
          setLoading(false);
        });
    },
    onError: (errorResponse) => {
      setLoading(false);
      dispatch(
        openSnackbar({
          message: errorResponse.error,
          severity: "error",
        })
      );
    },
  });

  return (
    <Container data-testid="signup">
      {showForgotPassword ? (
        <ForgetPassword setShowForgotPassword={setShowForgotPassword} />
      ) : (
        <div>
          <Title>SignIn</Title>
          <Form>
            <OutlinedInput>
              <EmailRounded />
              <Input
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </OutlinedInput>
            {
              // Show error message if there is one
              errorMessage?.email && (
                <Error style={{ color: "red" }}>{errorMessage.email}</Error>
              )
            }
            <OutlinedInput>
              <PasswordRounded />
              <Input
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
              />
              {showPassword ? (
                <Visibility
                  sx={{ fontSize: "20px" }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <VisibilityOff
                  sx={{ fontSize: "20px" }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </OutlinedInput>
            {
              // Show error message if there is one from the server
              errorMessage?.apierror && (
                <Error style={{ color: "red" }}>{errorMessage.apierror}</Error>
              )
            }
            {selectedOption === "admin" && (
              <ForgotPassword
                onClick={() => {
                  setShowForgotPassword(true);
                }}
              >
                Forgot password ?
              </ForgotPassword>
            )}
          </Form>
          <Button
            onClick={(e) => {
              handleSubmit(e);
            }}
            buttonDisabled={buttonDisabled}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>Sign In</>
            )}
          </Button>

          <Flex>
            <Hr />
            or
            <Hr />
          </Flex>

          <GoogleButton
            onClick={(e) => {
              googleLogin(e);
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <img src={google} alt="Google" width="20px" height="20px" />
                Continue with Google
              </>
            )}
          </GoogleButton>
          <Text>
            Don&apos;t have an account ?{" "}
            <TextButton onClick={() => setOpenSignUp(true)}>
              {" "}
              Sign Up
            </TextButton>
          </Text>
        </div>
      )}
    </Container>
  );
};

export default SignIn;
