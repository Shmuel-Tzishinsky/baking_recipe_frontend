export const getDay = () => {
  const d = new Date();
  const days = [];
  days[0] = "א";
  days[1] = "ב";
  days[2] = "ג";
  days[3] = "ד";
  days[4] = "ה";
  days[5] = "ו";
  days[6] = "ש";

  return days[d.getDay()];
};

export const getTime = () => {
  const date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // let x = h >= 12 ? 'pm' : 'am';
  // h = h % 12;
  // h = h ? h : 12;
  m = m < 10 ? "0" + m : m;
  let time = h + ":" + m;
  time += ":" + s;

  return time;
};

export const newDate = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getDate()}`;
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const matchTheProximityTime = (time) => {
  let timeMach;
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  let myTime = h + ":" + m;

  if (parseFloat(time?.split(":")[0]) >= parseFloat(myTime?.split(":")[0])) {
    // If hour == new hour
    if (parseFloat(time?.split(":")[0]) === parseFloat(myTime?.split(":")[0])) {
      // If minute >= new minute
      if (parseFloat(time?.split(":")[1]) >= parseFloat(myTime?.split(":")[1])) {
        timeMach = time;
        return true;
      }
    } else {
      timeMach = time;
      return true;
    }
  }

  // If not mach time bus
  if (!timeMach) {
    timeMach = time;
  }
  return false;
};

export const filterDabbleTravels = (travels) => {
  const newArrayTravels = [];

  for (let i = 0; i < travels.length; i++) {
    const t = newArrayTravels.filter((tr) =>
      tr["אשכול"] === travels[i]["אשכול"] &&
      tr["חלופה"] === travels[i]["חלופה"] &&
      tr["יום"] === travels[i]["יום"] &&
      tr["שעה"] === travels[i]["שעה"] &&
      tr["כיוון"] === travels[i]["כיוון"] &&
      tr[`מק"ט קו`] === travels[i][`מק"ט קו`] &&
      tr?.date?.split(" ")[0] === travels[i]?.date?.split(" ")[0]
        ? tr
        : false
    );
    if (t.length === 0) newArrayTravels.push(travels[i]);
  }

  return newArrayTravels || [];
};

export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  text += "";
  const parts = highlight?.length ? text.split(new RegExp(`(${highlight})`, "gi")) : [text];

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part?.toLowerCase() === highlight?.toLowerCase()
              ? { background: "yellow", color: "#000", borderRadius: "2px" }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export function timeCalculator(obj) {
  /* helper functions */
  const format = (n) => String(n).padStart(2, 0);

  const time2seconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);

    return seconds + minutes * 60 + hours * 60 * 60;
  };

  const seconds2time = (seconds) => {
    const hours = format(Math.floor(seconds / (60 * 60)));
    const minutes = format(Math.floor(seconds / 60) % 60);
    seconds = format(seconds % 60);

    return `${hours}:${minutes}:${seconds}`;
  };
  /* /helper functions */

  const toDuration = ({ startTime, endTime }) =>
    seconds2time(time2seconds(endTime) - time2seconds(startTime));

  const result = toDuration(obj);

  // console.log(`duration between ${obj.startTime} and ${obj.endTime} is: ${result}`);
  return result;
}

export const timePlusTime = (a, b) => {
  function toSeconds(s) {
    var p = s.split(":");
    return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60 + parseInt(p[2], 10);
  }

  function fill(s, digits) {
    s = s.toString();
    while (s.length < digits) s = "0" + s;
    return s;
  }

  var sec = toSeconds(a) + toSeconds(b);

  var result =
    fill(Math.floor(sec / 3600), 2) + ":" + fill(Math.floor(sec / 60) % 60, 2) + ":" + fill(sec % 60, 2);

  return result;
};
