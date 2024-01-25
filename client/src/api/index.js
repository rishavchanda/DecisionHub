import axios from "axios";
// https://decisionhub-t40p.onrender.com/api/
// http://localhost:8080/api/
const API = axios.create({
  baseURL: "https://decisionhub-t40p.onrender.com/api/",
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

export const getRules = async (filter, token) =>
  await API.get(`/user/getUserRules?f=${filter}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTableNames = async (token) =>
  await API.get(`/user/getTableList`, {
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

export const createRuleWithText = async (id, data, token) =>
  await API.patch(
    `/rule/ruleWithText/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );

export const searchRule = async (title, token) =>
  await API.get(
    `/rule/searchRule?title=${title}`,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );

export const getRuleById = async (id, token, version) =>
  await API.post(
    `/rule/${id}`,
    { version },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const updateRule = async (id, data, token) =>
  await API.patch(`/rule/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateRuleWithVersion = async (id, data, token) =>
  await API.patch(`/rule/updateRuleVersion/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteRule = async (id, version, token) =>
  await API.delete(`/rule/${id}/${version}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Testing
export const testRule = async (id, version, testData, token) =>
  await API.post(`/rule/testing/${id}/${version}`, testData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadExcel = async (data, id, token) =>
  await API.post(`/rule/testingWithData/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
