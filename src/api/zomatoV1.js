import React from "react";
import axios from "axios";
import { zomatoApiKey } from "../../secrets";

const zomatoV1 = axios.create({
  baseURL: "https://api.zomato.com/v1",
  headers: {
    "X-Zomato-API-Key": zomatoApiKey,
  },
});

export default zomatoV1;
