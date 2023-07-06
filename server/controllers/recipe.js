const sampleData = require("../data/sample_recipe_data.json");

exports.getRecipe = (req, res, next) => {
  console.log(req.query);

  res.json(sampleData).status(200);
};
