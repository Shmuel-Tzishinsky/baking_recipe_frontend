import { toast } from "react-toastify";
import { getStorageItem } from "../custom-hooks/useLocalStorage";

export const alertSuccess = (text) =>
  toast.success(text, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: getStorageItem("themeMode") === "theme-mode-dark" ? "dark" : "light",
  });

export const alertError = (text) =>
  toast.error(text, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: getStorageItem("themeMode") === "theme-mode-dark" ? "dark" : "light",
  });
