import { useEffect, useState } from "react";
import { BiBus } from "react-icons/bi";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import "./leftTheFirstStation.css";

export const LeftTheFirstStation = ({ setLeftTheFirstStation }) => {
  const [addTimeout, setAddTimeout] = useState(!0);

  function timeout() {
    setAddTimeout(!0);
    setTimeout(() => {
      setAddTimeout(!1);
    }, 20000);
  }

  useEffect(() => {
    setTimeout(() => {
      setAddTimeout(!1);
    }, 2000);
  }, [setAddTimeout]);

  return (
    <div
      className={`left-the-firsts-station ${addTimeout ? "smaller-the-box" : ""}`}
      onClick={addTimeout ? () => setAddTimeout(!1) : () => ""}
    >
      <div className="confirm">
        <div className="bell">
          <BiBus />
        </div>
        <div className="text">האם האוטובוס יצא לדרך?</div>
        <div className="no" onClick={timeout}>
          <AiOutlineCloseCircle />
        </div>
        <div className="yes" onClick={!addTimeout ? setLeftTheFirstStation : () => ""}>
          <AiOutlineCheckCircle />
        </div>
      </div>
    </div>
  );
};
