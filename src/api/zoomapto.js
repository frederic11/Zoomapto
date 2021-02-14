import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const zoomapto = axios.create({
  baseURL: "https://zoomapto.azurewebsites.net",
});

zoomapto.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    console.log("something is wrong!");
    return Promise.reject(err);
  }
);

export default zoomapto;
