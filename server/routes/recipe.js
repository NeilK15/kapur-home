const express = require("express");
const cors = require("cors");
const router = express.Router();

// Controller
const recipeController = require("../controllers/recipe");

router.use(cors());
router.use(express.json());

router.get("/fetchRecipeById", recipeController.getRecipeById);

router.post("/addRecipeByUrl", recipeController.postRecipeByUrl);

module.exports = router;
