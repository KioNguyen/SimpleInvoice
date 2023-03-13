import axios, { AxiosInstance } from "axios";

class HTTP {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_BASE_URL}`,
      timeout: 5000,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

const Http = new HTTP().instance;
export default Http;
