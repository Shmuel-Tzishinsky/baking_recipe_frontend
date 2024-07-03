import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./listPlusDrivers.css";

export const ListPlusDrivers = ({ num, addPlusOrMinusDrivers, openList, setOpenList, errorOnList }) => {
  const [array, setArray] = useState([]);

  useEffect(() => {
    let theArray = [];
    const length = openList === "minus" ? num : 30;

    for (let i = 1; i <= length; ) {
      theArray.push([i++, i++]);
    }
    setArray(theArray);
  }, [openList, num]);

  return (
    <div className="list-plus-drivers-container">
      <div className="hidden-all-page" onClick={() => setOpenList(!1)}></div>
      <div className="list-plus-drivers">
        <h4>בחר מספר</h4>
        {errorOnList && <h5 className="error-on-list">{errorOnList}</h5>}
        <button className="close" onClick={() => setOpenList(!1)}>
          <AiOutlineCloseCircle />
        </button>
        <div className="table-numbers">
          <table>
            {array.map((e, ind) => (
              <tbody key={ind}>
                <tr>
                  {e.map((td, i) => (
                    <td
                      key={i}
                      className={num >= td || openList === "plus" ? "" : "disabled"}
                      onClick={() => addPlusOrMinusDrivers(td, openList)}
                    >
                      {openList === "minus" ? `-${td}` : td}
                    </td>
                  ))}
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};
