import "./remarks.css";
import { MdModeEdit } from "react-icons/md";

import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useTravels } from "../../../../context/userTravels/travelsContext";

export const Remarks = () => {
  const { state, setRemarks } = useTravels();
  const { remarks } = state;

  const [show, setShow] = useState(!1);

  return (
    <div className={`add-remarks ${!show ? "show" : ""}`} onClick={() => ""}>
      <div className="confirm">
        <div className="bell" onClick={() => setShow(!0)}>
          <MdModeEdit />
        </div>
        <textarea
          placeholder="יש לך הערות?"
          cols="30"
          rows="10"
          value={remarks || ""}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="no" onClick={() => setShow(!1)}>
          <AiOutlineCloseCircle />
        </div>
      </div>
    </div>
  );
};
