import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import LoadingLogin from "../common/loading/Loading-login";
import { Link, Navigate } from "react-router-dom";
import "./Register.css";
import { BiLock, BiUser, BiMailSend } from "react-icons/bi";

const Register = () => {
  const [showPass, setShowPass] = useState(true);
  const [data, setData] = useState({
    name: "",
    uniqueName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "staff",
    isActive: true,
    remarks: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const { userState, registerUser } = useAuth();

  const onFinish = async (e) => {
    e.preventDefault();
    console.log(data);
    if (data.password !== data.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);

    const res = await registerUser(data);
    if (res) setRegisterSuccess(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(data.password === value.trim());
    }
  };

  return registerSuccess && !userState.error && !userState.loading ? (
    <Navigate to={"/baking_recipe_frontend/login"} />
  ) : (
    <div className="customers-Register">
      <div className="form_container">
        <h1 className="page-header">ברוך הבא!</h1>
        <p>אנא הכנס את פרטי החשבון</p>
        <form className="Register-form" onSubmit={onFinish}>
          <div>
            <label htmlFor="name">שם:</label>
            <div className="input-container">
              <input
                required
                type="text"
                name="name"
                placeholder="הכנס את השם שלך"
                autoComplete="on"
                value={data.name}
                className="rounded-pill"
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value.trim(),
                  })
                }
              />
              <BiUser />
            </div>
          </div>
          <div>
            <label htmlFor="uniqueName">אימייל: (אימות כניסה)</label>
            <div className="input-container">
              <input
                required
                name="uniqueName"
                placeholder="הכנס אימייל"
                autoComplete="on"
                value={data.uniqueName}
                className="rounded-pill"
                onChange={(e) =>
                  setData({
                    ...data,
                    uniqueName: e.target.value.trim(),
                  })
                }
              />
              <BiMailSend />
            </div>
          </div>
          <div>
            <label htmlFor="password">סיסמה:</label>
            <div className="input-container">
              <input
                required
                autoComplete="on"
                placeholder="הכנס סיסמה"
                type={showPass ? "password" : "text"}
                name="password"
                value={data.password}
                className="rounded-pill"
                onChange={handlePasswordChange}
              />
              <BiLock />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword">אשר סיסמה:</label>
            <div className="input-container">
              <input
                required
                autoComplete="on"
                placeholder="הכנס סיסמה שנית"
                type={showPass ? "password" : "text"}
                name="confirmPassword"
                value={data.confirmPassword}
                className="rounded-pill"
                onChange={handlePasswordChange}
              />
              <BiLock />
            </div>
            {!passwordMatch && <div style={{ color: "red" }}>הסיסמאות אינן תואמות</div>}
          </div>
          <label className="label-checkbox">
            <input type="checkbox" onChange={(e) => setShowPass(!e.target.checked)} />
            הצג סיסמה
          </label>
          <div>
            <button type="submit" className="Register-form-button" disabled={userState.loading}>
              {userState.loading ? <LoadingLogin /> : "הירשם"}
            </button>
          </div>
        </form>
        <div className="footer">
          כבר יש לך חשבון? <Link to="/baking_recipe_frontend/login">היכנס</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
