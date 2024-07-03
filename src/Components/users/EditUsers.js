import { useState } from "react";
import { RiCloseFill, RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import { alertError } from "../AlertOast";
import LoadingLogin from "../common/loading/Loading-login";
import { columns } from "./columns";

import { Switcher } from "../common/navMenu/Switcher";

import "./editUsers.css";
/**
 * i call the this file here because in netlify server i have
 * bug that makes me sure i call the this file in the first
 * father to make sure this file call only one time
 * 👇👇👇👇
 * */

const convertTime = (time) => {
  let newTime = time;
  if (newTime?.split(":")[0].length === 1) {
    newTime = `0${time}`;
  } else if (newTime?.split(":")[0] === "24") {
    newTime = newTime.replace("24:", "00:");
  }
  return newTime;
};

const EditRow = ({ editRow, loadEdit, callBack, closeAlertRow, error }) => {
  const [user, setUser] = useState(editRow === "addNewUser" ? [] : editRow || []);
  const [editPass, setPass] = useState();
  const onInput = ({ key, value }) => setUser({ ...user, [key]: value });

  const updateUser = (e) => {
    e.preventDefault();

    if (loadEdit) {
      alertError("פרטי הנסיעה עדיין בעריכה..");
    }

    //  data.isActive
    const dataState = {
      name: user.name.replace(/(^\s+|\s+$)/g, ""),
      phone: user?.phone?.replace(/(^\s+|\s+$)/g, ""),
      role: user?.role || "staff",
      password: user.password?.replace(/(^\s+|\s+$)/g, ""),
      uniqueName: user.uniqueName.replace(/(^\s+|\s+$)/g, ""),
      isActive: user.isActive ? true : false,
      remarks: user.remarks,
    };

    if (editRow !== "addNewUser") {
      dataState._id = user._id;
      !editPass && delete dataState.password;
    }

    callBack(dataState);
  };

  return (
    editRow && (
      <div className="alert-edit-user-container edit-user-alert">
        <div className="alert-hidden-all-page" onClick={!loadEdit ? closeAlertRow : () => ""}></div>
        <div className="alert-edit-user">
          <div className="alert-edit-users-head">
            <RiCloseFill
              className="close-user-icon"
              onClick={!loadEdit ? closeAlertRow : () => ""}
            />
            {editRow === "addNewUser" ? (
              loadEdit ? (
                <>
                  <h3>מוסיף את המשתמש...</h3>
                </>
              ) : (
                <>
                  <h3>הוסף משתמש חדש</h3>
                </>
              )
            ) : loadEdit ? (
              <>
                <h3>עורך את נתוני המשתמש...</h3>
              </>
            ) : (
              <>
                <h3>
                  ערוך את{" "}
                  <b onClick={!loadEdit ? closeAlertRow : () => ""}>
                    <Link to={`/users?q=${user.name}`}>{user.name}</Link>
                  </b>
                </h3>
              </>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          <div className={`edit-user-body ${loadEdit ? "loading" : ""}`}>
            <form onSubmit={updateUser}>
              <div className="users-edit-rows">
                {columns.map(
                  (c, i) =>
                    c.type !== "none" &&
                    (c.type === "switcher" ? (
                      <div className="user-row " key={i}>
                        <p>{c.text}:</p>
                        <div
                          className="switcher"
                          onClick={() => {
                            setUser({
                              ...user,
                              isActive: user.isActive ? false : true,
                            });
                          }}
                        >
                          <Switcher checked={user.isActive} />
                        </div>
                      </div>
                    ) : (
                      <div className="user-row" key={i}>
                        <p>
                          {c.text}:{c.text === "אימייל" ? " (אימות כניסה)" : ""}
                        </p>
                        <input
                          step={"1"}
                          type={c.type}
                          required={c.required}
                          onInput={(e) =>
                            onInput({
                              key: c.key,
                              value: e.target.value,
                            })
                          }
                          defaultValue={c.type === "time" ? convertTime(user[c.key]) : user[c.key]}
                        />
                      </div>
                    ))
                )}
                {(editPass || editRow === "addNewUser") && (
                  <div className="user-row">
                    <p>סיסמה:</p>
                    <input
                      step={"1"}
                      type={"text"}
                      onInput={(e) =>
                        onInput({
                          key: "password",
                          value: e.target.value,
                        })
                      }
                      required
                      defaultValue={user["password"]}
                    />
                  </div>
                )}

                <div className="user-row textarea">
                  <p>הערות:</p>
                  <textarea
                    step={"1"}
                    cols="30"
                    rows="4"
                    onInput={(e) =>
                      onInput({
                        key: "remarks",
                        value: e.target.value,
                      })
                    }
                    defaultValue={user["remarks"]}
                  />
                </div>
              </div>

              <div className="edit-user-buttons">
                <div>
                  {editRow !== "addNewUser" && (
                    <div
                      className="show-alert-pass"
                      onClick={() => {
                        setPass(!editPass);
                      }}
                    >
                      <RiLockPasswordLine
                        style={{
                          marginLeft: "4px",
                        }}
                      />
                      {editPass ? "אל תערוך סיסמה" : "ערוך סיסמה"}
                    </div>
                  )}
                </div>
                <div className="buttons">
                  <div className="back-btn" onClick={!loadEdit ? closeAlertRow : () => ""}>
                    חזור
                  </div>
                  <button type="submit">
                    {loadEdit ? <LoadingLogin /> : editRow === "addNewUser" ? "הוסף" : "ערוך"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default EditRow;
