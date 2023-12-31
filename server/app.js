const express = require("express");
const mongooseConnection = require("./connections/mongoose");
// const markZuckerberg = require("./middleware/logging");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

// app.use(markZuckerberg);

// Routes
const homeRouter = require("./routes/home");
const recipeRouter = require("./routes/recipe");

app.use("/recipes", recipeRouter);

app.use("/", homeRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`Ctrl-Click http://localhost:${PORT}`);
});
