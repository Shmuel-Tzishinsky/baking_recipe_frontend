import { useContext, createContext, useReducer } from "react";

import { getStorageItem, setStorageItem } from "../custom-hooks/useLocalStorage";

const initialUserState = {
  theme: getStorageItem("themeMode") || "theme-mode-light",
  color: getStorageItem("colorMode") || "theme-color-blue",
};

const themeContext = createContext(initialUserState);
themeContext.displayName = "theme-context";

const themeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.theme,
      };

    case "CHANGE_COLOR":
      return {
        ...state,
        color: action.color,
      };

    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialUserState);

  const changeTheme = () => {
    setStorageItem("themeMode", state.theme === "theme-mode-light" ? "theme-mode-dark" : "theme-mode-light");

    dispatch({
      type: "CHANGE_THEME",
      theme: state.theme === "theme-mode-light" ? "theme-mode-dark" : "theme-mode-light",
    });
  };

  const changeColor = (color) => {
    setStorageItem("colorMode", color);
    dispatch({
      type: "CHANGE_COLOR",
      color: color,
    });
  };

  return (
    <themeContext.Provider value={{ color: state.color, theme: state.theme, changeTheme, changeColor }}>
      <div className={`App ${state.theme} ${state.color}`}>{children}</div>
    </themeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(themeContext);
};
