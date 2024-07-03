import React, { useEffect, useState } from "react";

export const WarningMsg = ({ alert, pTitle, h5Title, callback, errorDelete, setAlert, dBtn, bBtn }) => {
  const [showAlert, setShowAlert] = useState(!1);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(alert);
    }, 20);
  }, [alert]);
  return (
    alert && (
      <div className="alert-container">
        <div className="alert-hidden-all-page" onClick={() => setAlert(!1)}></div>
        <div className={`alert-delete-travel ${showAlert ? "show" : ""}`}>
          <div className="alert-title">{pTitle}</div>
          {errorDelete && <div className="error">שגיאה: "{errorDelete}"</div>}
          <div className="alert-content">
            <p>{h5Title}</p>
            <div className="buttons">
              <div className="confirm-btn" onClick={callback}>
                {dBtn}
              </div>
              <div className="back-btn" onClick={() => setAlert(!1)}>
                {bBtn}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
