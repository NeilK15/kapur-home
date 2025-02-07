const express = require("express");
const router = express.Router();

router.use(express.raw());

router.get("/", (req, res) => {
    res.send("<h1>Bippity Boppity Boo?</h1>").status(200);
});

module.exports = router;
