import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const signIn = async (data) => await API.post("/user/signin", data);

export const createRule = async (data, token) =>
  await API.post(
    "/rule",
    data,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );
