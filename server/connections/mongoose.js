const mongoose = require("mongoose");
require("dotenv").config();

const RETRY_DELAY_MS = 5000;

async function connectWithRetry() {
    while (true) {
        try {
            await mongoose.connect(process.env.DB_URI);
            console.log("Connected to MongoDB");
            return;
        } catch (error) {
            console.error(`Error connecting to MongoDB, retrying in ${RETRY_DELAY_MS / 1000}s...`, error.message);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}

connectWithRetry();
