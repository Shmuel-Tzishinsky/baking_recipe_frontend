import React from "react";

import "./switcher.css";

export const Switcher = ({ checked = false }) => {
  return (
    <label className="Switcher ">
      <input type="checkbox" checked={checked} readOnly />
      <span className="widget"></span>
    </label>
  );
};
