import { useTravels } from "../../../context/userTravels/travelsContext";

import { BsFillPersonPlusFill, BsFillPersonDashFill } from "react-icons/bs";

import "./countingPassengers.css";
import { useEffect, useState } from "react";
import { FinishTravel } from "./finishTravel/FinishTravel";
import { Bubbles } from "./bubbles/Bubbles";
// import { TopNav } from "../topNav/TopNav";
import useLongPress from "../../../custom-hooks/useLongPress";
import { ListPlusDrivers } from "./listPlusDrivers/ListPlusDrivers";
import { AlertNumber } from "./alertNUmber/AlertNumber";
import { Remarks } from "./remarks/Remarks";
import { LeftTheFirstStation } from "./leftTheFirstStation/LeftTheFirstStation";
import { alertError } from "../../AlertOast";
import { setStorageItem } from "../../../custom-hooks/useLocalStorage";
import { initiallbubbuls, minusDriver, plusDriver, saveDrivers, saveEditBubble } from "./functions";
import { Dropdown } from "../navMenu/NavMenu";
import { getTime } from "../../../assets/js/globalFunc";
import { WarningMsg } from "../warningMsg/WarningMsg";

const CountingPassengers = () => {
  const { state, setTimeStartCounter, setLeftTheFirstStation, setTheTotalPassengers, resetTravel } =
    useTravels();

  const {
    kavSelected,
    leftTheFirstStation,
    roleSelected,
    totalPassengers,
    destinationStation,
    doorSelected,
  } = state;
  const [formFinish, setFormFinish] = useState(!1);
  const [editBubble, setEditBubble] = useState();
  const [openList, setOpenList] = useState(!1);
  const [errorOnList, setErrorOnList] = useState(!1);
  const [alertNumber, setAlertNumber] = useState(!1);
  const [count, setCount] = useState(() => (initiallbubbuls(totalPassengers).length ? 0 : "התחל"));
  const [bubbles, setBubbles] = useState(() => initiallbubbuls(totalPassengers));
  const [alertDeleteTravel, setAlertDeleteTravel] = useState(!1);

  const onMinusLongPress = () => setOpenList("minus");

  const onPLusLongPress = () => setOpenList("plus");

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };

  const addPlusOrMinusDrivers = (number, plusOrMinus) => {
    if (plusOrMinus === "plus") {
      if (typeof count === "string") setTimeStartCounter();

      if (editBubble) {
        setEditBubble({ ...editBubble, value: editBubble.value + number });
        setErrorOnList(!1);
        setOpenList(!1);
        return;
      }

      if (typeof count === "string") setTimeStartCounter();

      setCount((count) => (typeof count === "string" ? 0 : count) + number);
    } else {
      if (editBubble) {
        if (number - editBubble.value > 0) {
          setErrorOnList("מספר הנוסעים לא יכול להיות פחות מ-0");
          return;
        }
        setEditBubble({ ...editBubble, value: editBubble.value - number });
        setErrorOnList(!1);
        setOpenList(!1);
        return;
      }
      if (typeof count === "string" || number - count > 0) {
        setErrorOnList("מספר הנוסעים לא יכול להיות פחות מ-0");
        return;
      } else {
        setCount((count) => (typeof count === "string" ? 0 : count) - number);
      }
    }

    setOpenList(!1);
    setErrorOnList(!1);
  };

  useEffect(() => {
    setStorageItem("bubbles", bubbles);
    const drivers = bubbles.reduce((acc, obj) => acc + obj.value, 0);
    setTheTotalPassengers(drivers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbles]);

  useEffect(() => {
    if (formFinish && !leftTheFirstStation) {
      alertError("האוטובוס עוד לא עזב את התחנה הראשונה..");
      setFormFinish(!1);
    }
  }, [formFinish, leftTheFirstStation]);

  return (
    <>
      {alertDeleteTravel && (
        <WarningMsg
          alert={alertDeleteTravel}
          pTitle={"מחק נסיעה"}
          h5Title={"שים לב במידה ותבחר למחוק לא ניתן יהיה לשחזר את פרטי הנסיעה!"}
          callback={resetTravel}
          setAlert={setAlertDeleteTravel}
          dBtn={"מחק"}
          bBtn={"בטל"}
        />
      )}
      <div className="nav-menu">
        <Dropdown {...{ setAlertDeleteTravel }} />

        <div className="nav-menu-center">
          <TimeNow />
        </div>
        <div className="nav-menu-left">
          <div className="nav-menu-left-item" onClick={() => setFormFinish(true)}>
            <div className="topNav-finish">סיום</div>
          </div>
        </div>
      </div>

      <div className="counting-passengers">
        {formFinish && leftTheFirstStation && <FinishTravel setFormFinish={setFormFinish} />}
        {!leftTheFirstStation && <LeftTheFirstStation setLeftTheFirstStation={setLeftTheFirstStation} />}

        {alertNumber && <AlertNumber number={alertNumber.number} operator={alertNumber.operator} />}

        <div className="details">
          {openList && (
            <ListPlusDrivers
              {...{
                num: editBubble ? editBubble.value || 0 : count,
                setOpenList,
                addPlusOrMinusDrivers,
                openList,
                errorOnList,
              }}
            />
          )}
          <div className="details-on-travel">
            <p className="details-p">
              {kavSelected?.split(" - ")[0] && <span>קו: {kavSelected?.split(" - ")[0]} </span>}
              {destinationStation && <span>ל{destinationStation}</span>}

              <span>{roleSelected}</span>
              <span>דלת: {doorSelected}</span>
            </p>
            <h2 className="total-drivers">
              סך {roleSelected ? roleSelected.replace("ספירת ", "") : "נוסעים"}: <b>{totalPassengers || 0}</b>
              {leftTheFirstStation && <Remarks />}
            </h2>
          </div>
          <Bubbles {...{ bubbles, setBubbles, editBubble, setEditBubble }} />
        </div>

        <div className="drivers-buttons">
          <button
            className="plus-btn"
            {...useLongPress(
              onPLusLongPress,
              () =>
                plusDriver({
                  ...{
                    editBubble,
                    setEditBubble,
                    setTimeStartCounter,
                    setCount,
                    count,
                  },
                }),
              defaultOptions
            )}
          >
            <BsFillPersonPlusFill />
          </button>
          <button
            className={`confirm-btn ${editBubble ? "editBubble" : ""} ${
              count === "התחל" ? "start-count" : ""
            }`}
            disabled={typeof count === "string" || count <= 0 ? (editBubble ? false : true) : false}
            onClick={
              editBubble
                ? () =>
                    saveEditBubble({
                      ...{ bubbles, editBubble, setAlertNumber, setBubbles },
                    })
                : () =>
                    saveDrivers({
                      ...{
                        count,
                        setBubbles,
                        bubbles,
                        setAlertNumber,
                        setCount,
                      },
                    })
            }
            style={{
              fontSize: `${typeof count === "string" ? "1.7rem" : ""}`,
            }}
          >
            {editBubble ? editBubble.value || count : count}
          </button>
          <button
            disabled={
              typeof count === "string" || count <= 0 ? (editBubble?.value > 0 ? false : true) : false
            }
            className="minus-btn"
            {...useLongPress(
              onMinusLongPress,
              () =>
                minusDriver({
                  ...{
                    editBubble,
                    setEditBubble,
                    setCount,
                    count,
                  },
                }),
              defaultOptions
            )}
          >
            <BsFillPersonDashFill />
          </button>
        </div>
      </div>
    </>
  );
};

export default CountingPassengers;

const TimeNow = () => {
  const [timeNow, setTimeNow] = useState(getTime());
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setTimeNow(getTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div className="nav-menu-center-item">{timeNow}</div>;
};
