import React, { useEffect } from "react";
import "./bubbles.css";

export const Bubbles = ({ bubbles, setBubbles, editBubble, setEditBubble }) => {
  const startEditBubble = (ind) => {
    setBubbles(
      bubbles.map((item) =>
        item.id === ind
          ? { ...item, status: item.status === "edit" ? "active" : "edit" }
          : { ...item, status: "active" }
      )
    );

    setEditBubble(true);
  };

  useEffect(() => {
    let edit = bubbles.find((b) => b.status === "edit"); // return obj || undefined
    setEditBubble(edit);
  }, [bubbles, setEditBubble]);

  return (
    <div className="details-bubbles">
      {bubbles.map(({ value, status }, i) => (
        <div
          onClick={() => startEditBubble(i)}
          className={`bubble ${status === "edit" ? "edit" : ""} ${
            bubbles.length - 1 === i && !editBubble ? "the-new" : ""
          }`}
          key={i}
        >
          {value}
        </div>
      ))}
    </div>
  );
};
