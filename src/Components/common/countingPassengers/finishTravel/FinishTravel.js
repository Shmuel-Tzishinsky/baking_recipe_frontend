import React, { useEffect, useState } from "react";
import { getTime, newDate } from "../../../../assets/js/globalFunc";
import { useTravels } from "../../../../context/userTravels/travelsContext";
import LoadingLogin from "../../../common/loading/Loading-login";

import "./finishTravel.css";

export const FinishTravel = ({ setFormFinish }) => {
  const { state, setRemarks, submitTravel } = useTravels();
  const { openDoor, error, errResponse, loading, dayStartTravel, totalPassengers, remarks } = state;
  const [travelTime, setTravelTime] = useState("");
  const [finishTime] = useState(getTime);

  useEffect(() => {
    const timeConversion = () => {
      const dSTART = dayStartTravel + " " + openDoor;
      const eSTART = newDate() + " " + finishTime;
      const d = dSTART.replace(/[ :]/g, "-").split("-");
      const e = eSTART.replace(/[ :]/g, "-").split("-");
      d[0] = parseFloat(d[0]) - 1 + "";
      e[0] = parseFloat(e[0]) - 1 + "";

      const timeStart = new Date(d[0], d[1], d[2], d[3], d[4], d[5]);
      const timeEnd = new Date(e[0], e[1], e[2], e[3], e[4], e[5]);

      const millimes = timeEnd - timeStart;

      let seconds = (millimes / 1000).toFixed(1);

      let minutes = (millimes / (1000 * 60)).toFixed(1);

      let hours = (millimes / (1000 * 60 * 60)).toFixed(1);

      let days = (millimes / (1000 * 60 * 60 * 24)).toFixed(1);

      if (seconds < 60) {
        setTravelTime(seconds + " שניות");
        return seconds + " שניות";
      } else if (minutes < 60) {
        setTravelTime(minutes + " דקות");
        return minutes + " דקות";
      } else if (hours < 24) {
        setTravelTime(hours + "שעות");
        return hours + "שעות";
      } else {
        setTravelTime(days + "ימים");
        return days + "ימים";
      }
    };

    timeConversion();
  }, [dayStartTravel, openDoor, finishTime]);

  return (
    <div className="finish-travel-container">
      <div className="hidden-all-page" onClick={() => (loading ? "" : setFormFinish(false))}></div>
      <div className="finish-travel-form">
        <h1>סיכום נסיעה</h1>
        {error && errResponse && <h4 className="error">{errResponse}</h4>}
        <table>
          <tbody>
            <tr>
              <td>
                <div className="txt-td">{totalPassengers}</div>
              </td>
              <td className="th">
                <div className="txt-th">סך עלו: </div>
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr>
              <td>
                <div className="txt-td">{openDoor}</div>
              </td>
              <td className="th">
                <div className="txt-th">ש. התחלה: </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <div className="txt-td">{finishTime}</div>
              </td>
              <td className="th">
                <div className="txt-th">ש. סיום: </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <div className="txt-td">{travelTime}</div>
              </td>
              <td className="th">
                <div className="txt-th">משך נסיעה: </div>
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr>
              <td colSpan="100%">
                <textarea
                  placeholder="יש לך הערות?"
                  cols="30"
                  rows="4"
                  defaultValue={remarks}
                  disabled={loading ? true : false}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <button
                  className="select-finish"
                  onClick={() =>
                    submitTravel({
                      finishTime: finishTime,
                    })
                  }
                  disabled={loading}
                >
                  {loading ? <LoadingLogin /> : "שלח"}
                </button>
              </td>
              <td>
                <div className="select-back" onClick={() => (loading ? "" : setFormFinish(false))}>
                  חזור
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
