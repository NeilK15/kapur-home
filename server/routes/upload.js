const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");

router.post("/presign", uploadController.presign);

module.exports = router;
