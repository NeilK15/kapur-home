const express = require("express");
const cors = require("cors");
const mongooseConnection = require("./connections/mongoose");
const authMiddleware = require("./middleware/auth");
const app = express();

require("dotenv").config();

const REQUIRED_ENV = ["PORT", "DB_URI", "COGNITO_USER_POOL_ID", "COGNITO_APP_CLIENT_ID"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
    console.error("Missing required environment variables:", missing.join(", "));
    process.exit(1);
}

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

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Ctrl-Click http://localhost:${PORT}${ROOT}`);
});
