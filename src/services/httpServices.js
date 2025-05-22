import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL verification
});

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  httpsAgent: agent, // Add this to bypass SSL issues
});

export const setToken = (token) => {
  // console.log("token", token);
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) =>
    instance.get(url, { ...body, httpsAgent: agent }).then(responseBody),
  post: (url, body, headers) =>
    instance
      .post(url, body, { ...headers, httpsAgent: agent })
      .then(responseBody),
  put: (url, body) =>
    instance.put(url, body, { httpsAgent: agent }).then(responseBody),
};

export default requests;
