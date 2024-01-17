import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  EmailRounded,
  PasswordRounded,
  PersonRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { loginSuccess } from "../redux/reducers/userSlice";
import { signUp, findUserByEmail } from "../api";
import google from "../images/google.png";
import OTP from "./OTP";

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
  @media (max-width: 400px) {
    max-width: 320px;
    padding: 16px 16px 20px 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 400px) {
    font-size: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 18px 0px 12px 0px;
  gap: 10px;
  @media (max-width: 400px) {
    padding: 18px 0px 12px 0px;
  }
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
  @media (max-width: 400px) {
    font-size: 14px;
  }
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
  @media (max-width: 400px) {
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
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

const Error = styled.p`
  font-size: 12px;
  margin: 0px 4px;
  @media (max-width: 400px) {
    font-size: 10px;
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
  @media (max-width: 400px) {
    font-size: 14px;
  }s
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
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

const Text = styled.p`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;

const SignUp = ({ setOpenSignUp }) => {
  // hooks
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    password: "",
  }); // error message for validation checks.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verify OTP
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

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
      // Password validation regex pattern
      if (value && value.length < 8) {
        setErrorMessage({
          ...errorMessage,
          password: "Password must be atleast 8 characters long!",
        });
        setButtonDisabled(true);
      } else if (value && value.length > 16) {
        setErrorMessage({
          ...errorMessage,
          password: "Password must be less than 16 characters long!",
        });
        setButtonDisabled(true);
      } else if (
        value &&
        (!value.match(/[a-z]/g) ||
          !value.match(/[A-Z]/g) ||
          !value.match(/[0-9]/g) ||
          !value.match(/[^a-zA-Z\d]/g))
      ) {
        setErrorMessage({
          ...errorMessage,
          password:
            "Password must contain atleast one lowercase, uppercase, number and special character!",
        });
        setButtonDisabled(true);
      } else {
        setErrorMessage({
          ...errorMessage,
          password: "",
        });
      }
    }

    if (name === "name") {
      if (!value) {
        setButtonDisabled(true);
      }
      // name validation regex pattern
      const nameRegex = /^[A-Za-z0-9\s]+$/;

      if (value && !nameRegex.test(value)) {
        setErrorMessage({
          ...errorMessage,
          name: "name must contain only letters, numbers and spaces",
        });
        setButtonDisabled(true);
      } else {
        setErrorMessage({
          ...errorMessage,
          name: "",
        });
      }
    }

    if (name === "Confirm password") {
      setConfirmPassword(value);
      if (value !== formData.password) {
        setErrorMessage({
          ...errorMessage,
          confirm_password: "Password does not match",
        });
        setButtonDisabled(true);
      } else {
        setErrorMessage({
          ...errorMessage,
          confirm_password: "",
        });
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // If there is no error message and all the fields are filled, then enable the button
    if (
      !errorMessage.name &&
      !errorMessage.email &&
      !errorMessage.password &&
      formData.name &&
      formData.email &&
      formData.password &&
      confirmPassword === formData.password
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [confirmPassword, errorMessage, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If there is no error message, then submit the form
    if (!buttonDisabled) {
      setLoading(true);
      setButtonDisabled(true);
      findUserByEmail({ email: formData.email })
        .then((res) => {
          if (res.status === 200) {
            setButtonDisabled(false);
            setLoading(false);
            setErrorMessage({
              ...errorMessage,
              apierror: "Email already in use",
            });
          }
        })
        .catch((err) => {
          setButtonDisabled(false);
          if (err.response) {
            if (err.response.status === 404) {
              setShowOtp(true);
              setButtonDisabled(true);
              setLoading(false);
              setErrorMessage({
                ...errorMessage,
                apierror: "",
              });
            }
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

  const createAccount = () => {
    setShowOtp(false);
    setLoading(true);
    setButtonDisabled(true);
    signUp(formData)
      .then((res) => {
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
      })
      .catch((err) => {
        setLoading(false);
        setButtonDisabled(false);
        if (err.response) {
          setErrorMessage({
            ...errorMessage,
            apierror: err.response.data.message,
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            apierror: err.message,
          });
        }
      });
  };

  useEffect(() => {
    if (otpVerified) {
      createAccount();
    }
  }, [otpVerified]);

  return (
    <Container data-testid="signup">
      {!showOtp ? (
        <div>
          <Title>SignUp</Title>
          <Form>
            <OutlinedInput>
              <PersonRounded />
              <Input
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={16}
              />
            </OutlinedInput>
            {
              // Show error message if there is one
              errorMessage?.name && (
                <Error style={{ color: "red" }}>{errorMessage.name}</Error>
              )
            }
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
              // Show error message if there is one
              errorMessage?.password && (
                <Error style={{ color: "red" }}>{errorMessage.password}</Error>
              )
            }
            <OutlinedInput>
              <PasswordRounded />
              <Input
                placeholder="Confirm Password"
                name="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={handleInputChange}
              />
            </OutlinedInput>
            {
              // Show error message if there is one
              errorMessage?.confirm_password && (
                <Error style={{ color: "red" }}>
                  {errorMessage.confirm_password}
                </Error>
              )
            }
            {
              // Show error message if there is one from the server
              errorMessage?.apierror && (
                <Error style={{ color: "red" }}>{errorMessage.apierror}</Error>
              )
            }
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
              <>Create Account</>
            )}
          </Button>
          <Flex>
            <Hr />
            or
            <Hr />
          </Flex>

          <GoogleButton
            onClick={(e) => {
              handleSubmit(e);
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
            Already have an account?{" "}
            <TextButton onClick={() => setOpenSignUp(false)}>
              Sign In
            </TextButton>
          </Text>
        </div>
      ) : (
        <OTP
          email={formData.email}
          name={formData.name}
          otpVerified={otpVerified}
          setOtpVerified={setOtpVerified}
        />
      )}
    </Container>
  );
};

export default SignUp;
