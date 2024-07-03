import { useState } from "react";

export const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);

  if (status === "idle") {
    setStatus("pending");
    setValue(null);
    setError(null);
    asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      });
  }

  return { status, value, error };
};
