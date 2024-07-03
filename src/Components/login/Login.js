import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import LoadingLogin from "../common/loading/Loading-login";

import { BiLock, BiUser } from "react-icons/bi";

import "./login.css";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [showPass, setShowPass] = useState(!0);
  const [data, setData] = useState({
    uniqueName: "",
    password: "",
  });

  const { userState, LoginAction } = useAuth();

  const onFinish = async (e) => {
    e.preventDefault();
    LoginAction(data);
  };

  return userState.token?._id && !userState.error && !userState.loading ? (
    <Navigate to={"/baking_recipe_frontend/"} />
  ) : (
    <div className="customers-login">
      <div className="form_container">
        <h1 className="page-header">ברוך הבא!</h1>
        <p>אנא הכנס את פרטי החשבון</p>
        <form className="login-form" onSubmit={onFinish}>
          <div>
            <label htmlFor="name">שם משתמש:</label>
            <div className="input-container">
              <input
                required={true}
                type={"text"}
                name="uniqueName"
                placeholder="הכנס שם משתמש"
                autoComplete="on"
                defaultValue={data.uniqueName || ""}
                className="rounded-pill"
                onInput={(e) =>
                  setData({
                    ...data,
                    uniqueName: e.target.value?.replace(/(^\s+|\s+$)/g, ""),
                  })
                }
              />
              <BiUser />
            </div>
          </div>
          <div>
            <label htmlFor="name">סיסמה:</label>
            <div className="input-container">
              <input
                required={true}
                autoComplete="on"
                placeholder="הכנס סיסמה"
                type={showPass ? "password" : "text"}
                name="password"
                className="rounded-pill"
                defaultValue={data.password || ""}
                onInput={(e) =>
                  setData({
                    ...data,
                    password: e.target.value?.replace(/(^\s+|\s+$)/g, ""),
                  })
                }
              />
              <BiLock />
            </div>
            <label className="label-checkbox">
              <input type="checkbox" onChange={(e) => setShowPass(!e.target.checked)} />
              הצג סיסמה
            </label>

            {userState.error && (
              <div className="error">{userState.errResponse.replace("Error:", "")}</div>
            )}
          </div>

          <div>
            <button type="submit" className="login-form-button" disabled={userState.loading}>
              {userState.loading ? <LoadingLogin /> : "הכנס"}
            </button>
          </div>
        </form>
        <div className="footer">
          אין לך חשבון? <Link to="/baking_recipe_frontend/register">הירשם</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
