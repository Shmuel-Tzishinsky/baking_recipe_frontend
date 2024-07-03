import React from "react";
import { IoHomeOutline, IoStatsChartOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { FaRegBookmark } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";

export function NavBar() {
  const profile_data = [
    {
      icon: () => <IoHomeOutline />,
      content: "בית",
      route: "/baking_recipe_frontend/",
    },
    {
      icon: () => <FaRegBookmark />,
      content: "מועדפים",
      route: "/baking_recipe_frontend/favorite",
    },
    {
      icon: () => <MdOutlinePlaylistAdd />,
      content: "הוספה",
      route: "/baking_recipe_frontend/addnew",
      location: "middle",
    },
    {
      icon: () => <CiUser />,
      content: "משתמשים",
      route: "/baking_recipe_frontend/users",
    },
    {
      icon: () => <IoStatsChartOutline />,
      content: "סטטיסטיקה",
      route: "/baking_recipe_frontend/statistics",
    },
  ];

  return (
    <div className="NavBar">
      {profile_data.map((item, index) => (
        <NavLink
          key={index}
          className={({ isActive }) =>
            `con-nav ${isActive ? "active-link" : ""} ${item?.location || ""}`
          }
          to={item.route}
        >
          {item?.location === "middle" ? (
            <div className={item?.location}>{item.icon()}</div>
          ) : (
            item.icon()
          )}
          <span className="NavBar-name"> {item.content}</span>
        </NavLink>
      ))}
      {/* <NavLink
        to="/"
       
      >
        <IoHomeOutline />
      </NavLink>
      <NavLink
        to="/favorite"
        className={({ isActive }) => (isActive ? 'con-nav active-link' : 'con-nav')}
      >
      <FaRegBookmark />
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => (isActive ? 'con-nav active-link' : 'con-nav')}
      >
        <IoMdSearch />
      </NavLink>
      <NavLink
        to="/add"
        className={({ isActive }) => (isActive ? 'con-nav active-link' : 'con-nav')}
      >
        <IoMdAdd />
      </NavLink> */}
    </div>
  );
}
