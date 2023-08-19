import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localStorage } from "./localstorage";

type StorageData = Record<string, any>;

const useAsyncStorage = () => {
  const [storedData, setStoredData] = useRecoilState(localStorage);

  useEffect(() => {
    // Initialize the state with stored data from AsyncStorage
    const fetchStoredData = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const storedDataArray = await AsyncStorage.multiGet(allKeys);

        const parsedData: StorageData = {};
        storedDataArray.forEach(([key, value]) => {
          if (value !== null) {
            parsedData[key] = JSON.parse(value);
          }
        });
        setStoredData(parsedData);
      } catch (error) {
        console.error("Error fetching stored data from AsyncStorage:", error);
      }
    };

    fetchStoredData();
  }, [setStoredData]);

  const setItem = async (key: string, value: any) => {
    try {
      // Update the state
      const newData = { ...storedData, [key]: value };
      setStoredData(newData);

      // Update AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item in AsyncStorage:", error);
    }
  };

  const setItems = async (data: StorageData) => {
    try {
      // Update the state
      const newData = { ...storedData, ...data };
      setStoredData(newData);

      // Update AsyncStorage
      const promises = Object.entries(data).map(([key, value]) =>
        AsyncStorage.setItem(key, JSON.stringify(value)),
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error setting items in AsyncStorage:", error);
    }
  };

  const getItem = (key: string) => {
    return storedData[key];
  };

  const getItems = () => {
    return storedData;
  };

  const removeItem = async (key: string) => {
    try {
      // Update the state
      const newData = { ...storedData };
      delete newData[key];
      setStoredData(newData);

      // Update AsyncStorage
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from AsyncStorage:", error);
    }
  };

  const removeItems = async () => {
    try {
      // Clear the state
      setStoredData({});

      // Clear AsyncStorage
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error removing items from AsyncStorage:", error);
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

export default useAsyncStorage;
