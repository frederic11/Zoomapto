import React from "react";
import axios from "axios";
import { zomatoApiKey } from "../../secrets";

const zomato = axios.create({
  baseURL: "https://developers.zomato.com/api/v2.1",
  headers: {
    "user-key": zomatoApiKey,
  },
});

export default zomato;
