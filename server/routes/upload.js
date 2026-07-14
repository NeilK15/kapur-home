const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");

router.post("/image", uploadController.multerMiddleware, uploadController.uploadImage);

module.exports = router;
