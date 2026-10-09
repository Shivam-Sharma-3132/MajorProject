console.log("xyz");
const express = require("express");

const {
  add,
  update,
  getallCategories,
  status,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/add", add);
router.put("/update/:id", update);
router.get("/getallCategories", getallCategories);
router.patch("/status/:id", status);
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
