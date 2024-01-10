import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

//Auth
export const signIn = async (data) => await API.post("/auth/signin", data);
export const signUp = async (data) => await API.post("/auth/signup", data);
export const googleAuth = async (data) => await API.post("/auth/google", data);
export const generateOtp = async (name, email, reason) =>
  await API.get(
    `/auth/generate-otp?name=${name}&email=${email}&reason=${reason}`
  );
export const verifyOtp = async (otp) =>
  await API.get(`/auth/verify-otp?code=${otp}`);

// Reset Password
export const createResetSession = async () =>
  await API.get(`/auth/createResetSession`);
export const resetPassword = async (data) =>
  await API.put(`/auth/forgetpassword`, data);

// User
export const findUserByEmail = async (data) =>
  await API.post(`/user/findUserByEmail`, data);

export const getRecentActivity = async (token) =>
  await API.get(`/user/getRecentActivity`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Rules
export const createRule = async (data, token) =>
  await API.post(
    "/rule",
    data,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );

export const getRules = async (token) =>
  await API.get("/rule", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getRuleById = async (id, token) =>
  await API.get(`/rule/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateRule = async (id, data, token) =>
  await API.patch(`/rule/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteRule = async (id, token) =>
  await API.delete(`/rule/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
