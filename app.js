const express = require("express");
const path = require("path");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Start server on port ${port}!!`);
});

module.exports = app;
