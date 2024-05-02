import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Debug from "debug";
import express from "express";
import morgan from "morgan";
import path from "path";
import moment from "moment";

// import favicon from 'serve-favicon';
import index from "./routes/index";
import WeatherController from "./app/controllers/WeatherController";
// import logger from "./config/winston";

const app = express();
const debug = Debug("feed-healthcheck:app");
const cron = require("node-cron");
const cors = require("cors");
// global.logger = logger;

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// cron.schedule("0 0 */1 * * *", function() {
//   console.log("---------------------");
//   console.log(
//     "Running Cron Job in  WeatherController.cronjobToSlack Time: ",
//     moment().format("YYYY-MM-DD HH:mm")
//   );
//   WeatherController.cronjobToSlack();
// });

// Handle uncaughtException
process.on("uncaughtException", err => {
  debug("Caught exception: %j", err);
  process.exit(1);
});

export default app;
