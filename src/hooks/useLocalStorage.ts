import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Initialize with the default value (so server rendering works)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // 2. We use a separate state to track if we are essentially "ready" to read storage
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This runs only on the client, after the first render
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
    setIsInitialized(true);
  }, [key]);

  // 3. Wrapper to save to both State and LocalStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { storedValue, setValue, isLoaded: isInitialized };
}