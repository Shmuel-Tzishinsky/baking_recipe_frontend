import "./alertNumber.css";

import React from "react";

export const AlertNumber = ({ number, operator }) => (
  <div className="alert-number">
    {number}
    {operator ? "+" : "-"}
  </div>
);
