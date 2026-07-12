const express = require("express");
const cors = require("cors");
const mongooseConnection = require("./connections/mongoose");
const authMiddleware = require("./middleware/auth");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;
const VERSION = "v1";
const ROOT = `/${VERSION}`;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(ROOT, authMiddleware);

// Routes
const homeRouter = require("./routes/home");
const recipeRouter = require("./routes/recipe");
const cookbookRouter = require("./routes/cookbook");
const uploadRouter = require("./routes/upload");

app.use(`${ROOT}/recipes`, recipeRouter);
app.use(`${ROOT}/cookbooks`, cookbookRouter);
app.use(`${ROOT}/upload`, uploadRouter);
app.use(ROOT, homeRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Ctrl-Click http://localhost:${PORT}${ROOT}`);
});
