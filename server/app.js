const express = require("express");
require("./src/database/mongoose");
const Counter = require("./src//database/models/counter");
const app = express();
const PORT = 8000;

app.listen(8000, () => {
  const counter = new Counter({ num: 0 });
  counter.save();
  console.log(counter.num);
  console.log(`Listening on port ${PORT}`);
});
