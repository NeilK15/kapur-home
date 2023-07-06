const express = require("express");
const cors = require("cors");
const router = express.Router();

// Controller
const recipeController = require("../controllers/recipe");

router.use(cors());
router.use(express.json());

router.get("/", recipeController.getRecipe);

module.exports = router;
