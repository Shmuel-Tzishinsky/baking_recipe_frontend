import React from "react";
import { useTravels } from "../../../context/userTravels/travelsContext";
import { GiBusDoors, GiBusStop } from "react-icons/gi";

import "./circleButton.css";
import { HandClick } from "./handClick/HandClick.js";
import { NavMenu } from "../navMenu/NavMenu";

const CircleButton = ({ selection }) => {
  const { state, backPage, nextPage, openDoorSelected, busInTheStationSelected } = useTravels();
  const { openDoor, busInTheStation } = state;

  const details = {
    busInTheStation: {
      title: ["זמן התייצבות האוטובוס", "בתחנה הראשונה"],
      click: busInTheStationSelected,
      class: busInTheStation ? "loading" : selection,
      disabled: !1,
      txtInBtn: busInTheStation,
      icon: <GiBusStop />,
      buttons: true,
    },
    openDoor: {
      title: ["זמן פתיחת דלתות", "בתחנה הראשונה"],
      click: openDoorSelected,
      class: openDoor ? "loading" : selection,
      disabled: !1,
      txtInBtn: openDoor,
      icon: <GiBusDoors />,
      buttons: true,
    },
  };

  return (
    <>
      <NavMenu />

      <div className={`select-travel first-station ${selection === "start" ? "home-page" : ""}`}>
        <h2>
          {details[selection]?.title?.map((title, i) => (
            <p key={i}>{title}</p>
          ))}
        </h2>
        <div className={`start-travel ${details[selection].class}`} onClick={details[selection].click}>
          {details[selection].txtInBtn ? <span>{details[selection].txtInBtn}</span> : details[selection].icon}

          {details[selection].buttons && !details[selection].txtInBtn && <HandClick />}
        </div>

        {details[selection].buttons && (
          <div className="travel-buttons">
            <button className="select-next" disabled={!details[selection].txtInBtn} onClick={nextPage}>
              הבא
            </button>
            <button className="select-back" onClick={backPage}>
              הקודם
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CircleButton;
