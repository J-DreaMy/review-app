import { default as defaultAxios } from "axios";

const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: {
    "Content-type": "application/json",
  },
});

export default axios;
