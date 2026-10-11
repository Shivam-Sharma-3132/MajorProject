// console.log("xyz");
const express = require("express");
const auth = require("../auth");
const checkPermission = require("../checkPermission");

const {
  add,
  update,
  getallCategories,
  status,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/add", auth, checkPermission("category_add"), add);
router.put("/update/:id", auth, checkPermission("category_add"), update);
router.get(
  "/getallCategories",
  auth,
  checkPermission("category_add"),
  getallCategories,
);
router.patch("/status/:id", auth, checkPermission("category_add"), status);
router.delete(
  "/deleteCategory/:id",
  auth,
  checkPermission("category_add"),
  deleteCategory,
);

module.exports = router;
