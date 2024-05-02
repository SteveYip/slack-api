import express from "express";

import SearchController from "../app/controllers/SearchConrtoller";
import ActionController from "../app/controllers/ActionController";
import WeatherController from "../app/controllers/WeatherController";
import WebController from "../app/controllers/WebController";

var jwt = require("jsonwebtoken");
import moment from "moment";

const router = express.Router();
/* GET index page. */

router.post("/", SearchController.replyToSlack);
// router.get("/", SearchController.replyToSlack);

router.post("/action/response", ActionController.ActionResponse);
router.post("/event/response", ActionController.EventResponse);

router.post("/weather", WeatherController.replyToSlack);

router.get("/auth", (req, res) => {
  var unfurls_json = {};
  var attachment = {
    text: "Some Text",
  };
  unfurls_json["https://www.youtube.com/watch?v=rDFazMbFR2Y"] = attachment;
  console.log(JSON.stringify(unfurls_json));
  res.send(JSON.stringify(unfurls_json));
});

router.get("/temp", async (req, res) => {
  res.send("hello world");
});

router.get("/signjwt", async (req, res) => {
  const token = jwt.sign(
    {
      maxAge: "1h",
      time: moment().format("YYYY-MM-DD"),
      text: req.body.input,
    },
    process.env.JWT_SECRECT,
    { expiresIn: "30m" },
  );
  res.json({ token });
});

router.get("/web/weather", WebController.getWeatherInfo);
export default router;
