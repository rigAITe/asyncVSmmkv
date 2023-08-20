import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { MMKV } from "react-native-mmkv";
import { globalStore } from "./globalStore";

type StorageData = Record<string, any>;

const useMMKVStorage = () => {
  const [storedData, setStoredData] = useRecoilState(globalStore);

  // Create the storage object using useMemo
  const storage = useMemo(() => {
    try {
      return new MMKV();
    } catch (error) {
      console.error("Error initializing MMKV:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Initialize the state with stored data from MMKV
    const fetchStoredData = () => {
      if (!storage) return;

      try {
        const allKeys = storage.getAllKeys();
        const storedDataArray = allKeys.map((key) => [
          key,
          storage.getString(key),
        ]);

        const parsedData: StorageData = {};
        storedDataArray.forEach(([key, value]) => {
          if (typeof key === "string" && value !== undefined) {
            parsedData[key] = JSON.parse(value);
          }
        });
        setStoredData(parsedData);
      } catch (error) {
        console.error("Error fetching stored data from MMKV:", error);
      }
    };

    fetchStoredData();
  }, [setStoredData, storage]);

  const setItem = (key: string, value: any) => {
    if (!storage) return;

    try {
      // Update the state
      const newData = { ...storedData, [key]: value };
      setStoredData(newData);

      // Update MMKV
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item in MMKV:", error);
    }
  };

  const setItems = (data: StorageData) => {
    if (!storage) return;

    try {
      // Update the state
      const newData = { ...storedData, ...data };
      setStoredData(newData);

      // Update MMKV
      Object.entries(data).forEach(([key, value]) => {
        if (typeof key === "string") {
          storage.set(key, JSON.stringify(value));
        }
      });
    } catch (error) {
      console.error("Error setting items in MMKV:", error);
    }
  };

  const getItem = (key: string) => {
    return storedData[key];
  };

  const getItems = () => {
    return storedData;
  };

  const removeItem = (key: string) => {
    if (!storage) return;

    try {
      // Update the state
      const newData = { ...storedData };
      delete newData[key];
      setStoredData(newData);

      // Update MMKV by deleting the key
      storage.delete(key);
    } catch (error) {
      console.error("Error removing item from MMKV:", error);
    }
  };

  const removeItems = () => {
    if (!storage) return;

    try {
      // Clear the state
      setStoredData({});

      // Clear MMKV by resetting it
      storage.clearAll();
    } catch (error) {
      console.error("Error removing items from MMKV:", error);
    }
  };

  return {
    storedData,
    setItem,
    setItems,
    getItem,
    getItems,
    removeItem,
    removeItems,
  };
};

export default useMMKVStorage;
