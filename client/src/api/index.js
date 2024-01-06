import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

//Auth

export const signIn = async (data) => await API.post("/auth/signin", data);
export const signUp = async (data) => await API.post("/auth/signup", data);
export const generateOtp = async (name, email, reason) =>
  await API.get(
    `/auth/generate-otp?name=${name}&email=${email}&reason=${reason}`
  );
export const verifyOtp = async (otp) =>
  await API.get(`/auth/verify-otp?code=${otp}`);

// User
export const findUserByEmail = async (data) =>
  await API.post(`/user/findUserByEmail`, data);

// Rules
export const createRule = async (data, token) =>
  await API.post(
    "/rule",
    data,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );
