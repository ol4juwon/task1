"use strict";
require("dotenv").config({});
let express = require("express");
let app = express();
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 4000;

app.get("/api/v1/me", (req, res, next) => {
  const { slack_name, track } = req.query;
  if (!slack_name && !track)
    return res
      .status(400)
      .json({ error: "Please provide your slack name and track" });
  if (!validTrack(track))
    return res
      .status(422)
      .send({ error: "please provide a valid track", status_code: "400" });
  const currentDay = getCurrentDay();
  return res.status(200).json({
    slack_name: slack_name,
    current_day: currentDay,
    utc_time: new Date(),
    track: track,
    github_file_url: "https://github.com/ol4juwon/task1/blob/main/server.js",
    github_repo_url: "https://github.com/ol4juwon/task1",
    status_code: "200",
  });
});
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
