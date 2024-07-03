import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Router from "./Router";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/theme.context";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {showSplash ? (
        <div className="splash-screen">
          <div className="images">
            <div className="splash-images-main">
              <div className="main-image" />
            </div>
            <div className="splash-images">
              <div className="image1" />
              <div className="image2" />
              <div className="image3" />
              <div className="image4" />
              <div className="image5" />
              <div className="image6" />
              <div className="image8" />
            </div>
          </div>
          <h1 className="animated">ביחד במטבח</h1>

          <p className="animated">
            האפליקציה שמגיעה לשדרג את חוויית הבישול והאפייה במשפחה. שמרו, שתפו וגלו מתכונים ויחד צרו
            חוויות משותפות!
          </p>

          <div className="start-txt animated" onClick={() => setShowSplash(false)}>
            מיד נתחיל
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "90px" }}>
          <ToastContainer rtl={true} />
          <Router />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
