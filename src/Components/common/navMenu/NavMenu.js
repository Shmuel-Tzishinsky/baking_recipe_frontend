import React, { useState } from "react";

import { useLocation } from "react-router";
import { useAuth } from "../../../context/auth/AuthContext";
import { useTheme } from "../../../context/theme.context";
import { useRecipes } from "../../../context/Recipe/RecipesContext";

import "./NavMenu.css";
import { Switcher } from "./Switcher";

import {
  MdOutlineNightlight,
  MdLightMode,
  MdBarChart,
  MdOutlineUploadFile,
  MdOutlinePalette,
} from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { FiUsers } from "react-icons/fi";
import { BiCategory, BiHomeAlt } from "react-icons/bi";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import SetColor, { ListColors } from "./SetColor";

export const NavMenu = () => {
  return (
    <div className="nav-menu">
      <Dropdown />
    </div>
  );
};

export const Dropdown = ({ setAlertDeleteTravel }) => {
  const [toggle, setToggle] = useState();

  const location = useLocation();

  const { theme, changeTheme } = useTheme();

  const { userState, AuthReset } = useAuth();

  const [selectColor, setSelectColor] = useState(!1);
  const profile_data = [
    {
      icon: () => <BiCategory />,
      content: "דף הבית",
      callback: () => "",
      route: "/",
      display:
        location.pathname !== "/" &&
        (userState.token?.role === "admin" || userState.token?.role === "staff"),
    },
    {
      icon: () => (theme !== "theme-mode-light" ? <MdLightMode /> : <MdOutlineNightlight />),
      content: `מצב ${theme !== "theme-mode-light" ? "יום" : "לילה"}`,
      leftComponent: () => <Switcher checked={theme !== "theme-mode-light"} />,
      callback: changeTheme,
      display: true,
    },
    {
      icon: () => <MdOutlinePalette />,
      content: "בחר צבע",
      leftComponent: () => <SetColor selectColor={selectColor} />,
      callback: () => setSelectColor(!selectColor),
      display: true,
    },
    {
      icon: () => "",
      content: () => <ListColors {...{ selectColor, setSelectColor }} />,
      callback: () => "",
      display: selectColor,
    },
    {
      icon: () => <FiUsers />,
      content: "משתמשים",
      callback: () => "",
      route: "/users",
      display: userState.token?.role === "admin" || userState.token?.role === "staff",
    },
    {
      icon: () => <MdBarChart />,
      content: "סטטיסטיקות",
      callback: () => "",
      route: "/statistics",
      display: userState.token?.role === "admin" || userState.token?.role === "staff",
    },
    {
      icon: () => <MdBarChart />,
      content: "מועדפים",
      callback: () => "",
      route: "/favorite",
      display: userState.token?.role === "admin" || userState.token?.role === "staff",
    },
    {
      icon: () => <MdOutlineUploadFile />,
      content: "הוספה",
      callback: () => "",
      route: "/addnew",
      display: userState.token?.role === "admin" || userState.token?.role === "staff",
    },

    {
      icon: () => <AiOutlineLogout />,
      content: "התנתק",
      callback: AuthReset,
      display: true,
    },
  ];

  return (
    <div className={`dropdown-menu`}>
      {location.pathname !== "/" && (
        <h2 className="title-page">
          <div className="icons">
            <Link to={"/"}>
              <BiHomeAlt />
            </Link>{" "}
            <MdOutlineKeyboardArrowLeft />
          </div>
          {profile_data.filter((r) => r.route === location.pathname)[0]?.content}
        </h2>
      )}
      <button
        className={`toggle-menu-btn ${toggle ? "active" : ""}`}
        onClick={() => setToggle(!toggle)}
      >
        <div className="menu-icon"></div>
        <div className="menu-icon-ripple"></div>
      </button>
      <MenuContainer
        {...{
          setToggle,
          toggle,
          profile_data,
        }}
      />
      {/* <div className="img">
        <img src={require("../../../assets/images/Recipe-logo.png")} alt="" />
      </div> */}
    </div>
  );
};

const MenuContainer = ({ setToggle, toggle, profile_data }) => {
  return (
    <div className={`menu-container ${toggle ? "active" : ""}`}>
      {toggle && <div className="hidden-content" onClick={() => setToggle(!1)}></div>}
      <div className={`menu-content ${toggle ? "active" : ""}`}>
        {profile_data.map(
          (item, index) =>
            item.display &&
            (item.route ? (
              <Link key={index} className="menu-item" to={item.route} onClick={() => setToggle(!1)}>
                {item.icon()}
                <span className="menu-item-name"> {item.content}</span>
                {item.leftComponent && item.leftComponent()}
              </Link>
            ) : (
              <div
                key={index}
                className={`menu-item ${typeof item.content === "function" ? "list-colors" : ""}`}
                onClick={item.callback}
              >
                {item.icon()}

                {typeof item.content === "function" ? (
                  item.content()
                ) : (
                  <span className="menu-item-name"> {item.content} </span>
                )}

                {item.leftComponent && item.leftComponent()}
              </div>
            ))
        )}
      </div>
    </div>
  );
};
