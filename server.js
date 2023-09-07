"use strict";
require("dotenv").config({});
let express = require("express");
let app = express();
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 4000;
/**
 * me endpoint
 */
app.get("/api", (req, res, next) => {
  const { slack_name, track } = req.query;
  if (!slack_name)
    return res
      .status(400)
      .json({ error: "Please provide your slack name" });

  if (!validTrack(track))
    return res
      .status(422)
      .send({ error: "please provide a valid track", status_code: "400" });

  if (!allowedTimeZones()) {
    return res
      .status(400)
      .json({
        error: `Current UTC time (${new Date()}) is outside the allowed time range.`,
      });
  }
  const currentDay = getCurrentDay();
  return res.status(200).json({
    slack_name: slack_name,
    current_day: currentDay,
    utc_time: formatUTC(new Date()),
    track: track,
    github_file_url: "https://github.com/ol4juwon/task1/blob/main/server.js",
    github_repo_url: "https://github.com/ol4juwon/task1",
    status_code: "200",
  });
});
/**
 * Get's current day
 * @returns {String}
 */
const getCurrentDay = () => {
  const currentDate = new Date();
  console.log(currentDate);
  const day = currentDate.getDay();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[day];
};
/**
 * checks for valid track
 * @param {string} track 
 * @returns {boolean} 
 */
const validTrack = (track) => {
  switch (track.toLowerCase()) {
    case "mobile":
    case "backend":
    case "frontend":
    case "product design":
    case "video marketing":
      return true;
    default:
      return false;
  }
};

/**
 * check for allowed time zones
 * @returns {boolean}
 */
const allowedTimeZones = () => {
  const currentUTC = new Date();

  const currentUTCTime = currentUTC.getTime();
  const allowedTimeRange = 2 * 60 * 1000;
  const minAllowedTime = new Date(currentUTCTime - allowedTimeRange);

  const maxAllowedTime = new Date(currentUTCTime + allowedTimeRange);
  if (
    currentUTCTime >= minAllowedTime.getTime() &&
    currentUTCTime <= maxAllowedTime.getTime()
  ) {
    return true;
  } else {
    return false;
  }
};
const formatUTC = (time) => {
 
const year = time.getUTCFullYear();
const month = String(time.getUTCMonth() + 1).padStart(2, '0');
const day = String(time.getUTCDate()).padStart(2, '0');
const hours = String(time.getUTCHours()).padStart(2, '0');
const minutes = String(time.getUTCMinutes()).padStart(2, '0');
const seconds = String(time.getUTCSeconds()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

return formattedDate;
}

server.listen(port);
server.setTimeout(500000);
server.on("error", (error) => {
  console.log("Error", error);
});
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on localhost: " + bind);
});
