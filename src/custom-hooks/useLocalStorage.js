const getStorageItem = (key) => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) return;

  return window.localStorage.getItem(key);
};

const setStorageItem = (key, value) => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) return;

  return window.localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value)
  );
};

const removeStorageItem = (key) => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) return;

  return window.localStorage.removeItem(key);
};

const clearStorage = () => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) return;

  return window.localStorage.clear();
};

export { getStorageItem, setStorageItem, removeStorageItem, clearStorage };
