import React from "react";
import "./setColor.css";
import { AiFillCaretDown } from "react-icons/ai";
import { useTheme } from "../../../context/theme.context";

const SetColor = ({ selectColor }) => {
  return (
    <div className={`set-color ${selectColor ? "active" : ""}`}>
      <AiFillCaretDown className="caret" />
    </div>
  );
};

export default SetColor;

const color_list = [
  {
    id: "blue",
    name: "כחול",
    background: "blue-color",
    class: "theme-color-blue",
  },
  {
    id: "red",
    name: "אדום",
    background: "red-color",
    class: "theme-color-red",
  },
  {
    id: "cyan",
    name: "טורקיז",
    background: "cyan-color",
    class: "theme-color-cyan",
  },
  {
    id: "green",
    name: "ירוק",
    background: "green-color",
    class: "theme-color-green",
  },
  {
    id: "orange",
    name: "כתום",
    background: "orange-color",
    class: "theme-color-orange",
  },
  {
    id: "purple",
    name: "סגול",
    background: "purple-color",
    class: "theme-color-purple",
  },
  {
    id: "yellow",
    name: "צהוב",
    background: "yellow-color",
    class: "theme-color-yellow",
  },
  {
    id: "pink",
    name: "וורוד",
    background: "pink-color",
    class: "theme-color-pink",
  },
  {
    id: "gray",
    name: "אפור",
    background: "strongBlue-color",
    class: "theme-color-strongBlue",
  },
];
export const ListColors = ({ selectColor, setSelectColor }) => {
  const { color, changeColor } = useTheme();

  const setColor = (color) => {
    changeColor(color);
  };

  return color_list.map((c) => (
    <div
      style={color === c.class ? { padding: "0.436rem" } : { padding: "0.78516rem" }}
      key={c.id}
      className={`color-item ${c.background}`}
      id={c.id}
      onClick={() => setColor(c.class)}
    >
      {color === c.class && <div className="point"></div>}
    </div>
  ));
};
