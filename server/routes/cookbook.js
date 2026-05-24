const express = require("express");
const router = express.Router();
const cookbookController = require("../controllers/cookbook");

router.get("/", cookbookController.getCookbooks);
router.post("/", cookbookController.postCookbook);
router.get("/:id", cookbookController.getCookbook);
router.put("/:id", cookbookController.putCookbook);
router.delete("/:id", cookbookController.deleteCookbook);

module.exports = router;
