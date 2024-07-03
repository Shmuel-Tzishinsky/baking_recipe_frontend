import { isJsonString } from "../../../assets/js/globalFunc";
import { getStorageItem } from "../../../custom-hooks/useLocalStorage";

export const initiallbubbuls = (totalPassengers) => {
  if (isJsonString(getStorageItem("bubbles"))) {
    if (
      JSON.parse(getStorageItem("bubbles")) &&
      JSON.parse(getStorageItem("bubbles")).length !== 0
    ) {
      return JSON.parse(getStorageItem("bubbles"));
    }
  }
  return totalPassengers
    ? [
        {
          id: 0,
          value: totalPassengers,
          status: "active",
        },
      ]
    : [];
};

export const plusDriver = ({
  editBubble,
  setEditBubble,
  setTimeStartCounter,
  setCount,
  count,
}) => {
  if (editBubble) {
    setEditBubble({ ...editBubble, value: editBubble.value + 1 });
    return;
  }
  if (typeof count === "string") {
    setTimeStartCounter();
    setCount(1);
  } else {
    setCount((count) => count + 1);
  }
};

export const minusDriver = ({ editBubble, setEditBubble, setCount, count }) => {
  if (editBubble?.value > 0) {
    setEditBubble({ ...editBubble, value: editBubble.value - 1 });
    return;
  }
  if (typeof count === "string") {
    return;
  } else if (count > 0) {
    setCount((count) => count - 1);
  }
};

export const saveDrivers = ({
  count,
  setBubbles,
  bubbles,
  setAlertNumber,
  setCount,
}) => {
  if (count && typeof count !== "string") {
    setBubbles([
      ...bubbles,
      {
        id: bubbles.length,
        value: count,
        status: "active",
      },
    ]);
    setAlertNumber({
      number: count,
      operator: "+",
    });
    setCount(0);

    setTimeout(setAlertNumber, 700);
  }
};

export const saveEditBubble = ({
  bubbles,
  editBubble,
  setAlertNumber,
  setBubbles,
}) => {
  const prevNum =
    bubbles.filter((item) => item.id === editBubble?.id)[0]?.value || 0;

  let getBigNum, getLessNum;
  if (editBubble.value >= prevNum) {
    getBigNum = editBubble.value;
    getLessNum = prevNum;
  } else if (editBubble.value <= prevNum) {
    getBigNum = prevNum;
    getLessNum = editBubble.value;
  }

  prevNum !== editBubble.value &&
    setAlertNumber({
      number: getBigNum - getLessNum,
      operator: prevNum <= editBubble.value,
    });

  setTimeout(setAlertNumber, 700);
  if (editBubble.value === 0) {
    let newBubble = bubbles.filter((item) => item.id !== editBubble.id);

    setBubbles(newBubble);

    setBubbles(
      newBubble.map((item, i) => {
        return { ...item, id: i };
      })
    );
  } else
    setBubbles(
      bubbles.map((item) =>
        item.id === editBubble.id
          ? { ...item, value: editBubble.value, status: "active" }
          : { ...item, status: "active" }
      )
    );
};
