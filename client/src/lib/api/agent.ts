import axios from "axios";
import { store } from "../store/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";
import "react-toastify/dist/ReactToastify.css";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

agent.interceptors.request.use((config) => {
  store.uiStore.isBusy();
  return config;
});

agent.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    store.uiStore.isIdle();
    return response;
  },

  async (error) => {
    await sleep(1000);
    store.uiStore.isIdle();

    // 1. Guard against network disconnection or server offline
    if (!error.response) {
      toast.error("Network error: unable to connect to server");
      return Promise.reject(error);
    }

    // 2. Safe to destructure now
    const { status, data } = error.response;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        } else if (typeof data === "string") {
          toast.error(data); // Handles raw string messages
        } else {
          toast.error(data.title || "Bad request");
        }
        break;
      case 401:
        toast.error("Unauthorized");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        router.navigate("/server-error", {state:{error: data}});
        break;
      default:
        toast.error("Unhandled error");
        break;
    }

    return Promise.reject(error);
  },
);

export default agent;
