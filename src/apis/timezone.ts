import React from "react";
import axios, { AxiosResponse } from "axios";

export const getTimezone = async (latitude: number, longitude: number) => {
  try {
    const res: AxiosResponse<ITimezoneRS> = await axios({
      method: "GET",
      url: `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_DB_TOKEN}&format=json&by=position&lat=${latitude}&lng=${longitude}`,
    });
    if (res.data.status === "OK") {
      const cityDate = new Date(res.data.formatted);

      const formattedDate = cityDate.toLocaleString("en-UK", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "long",
      });

      return formattedDate.split(" ").reverse().join(", ");
    } else {
      return "";
    }
  } catch (err) {
    console.log(err);
  }
};
