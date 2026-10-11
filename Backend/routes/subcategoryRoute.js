const express = require("express");
const {} = require("../controllers/adminController");
const auth = require("../auth");
const checkPermission = require("../checkPermission");
const {
  subAdd,
  subUpdate,
  subGetallCategories,
  subStatus,
  subDeleteCategory,
} = require("../controllers/subcategoryController");

const router = express.Router();

router.post("/subAdd", auth, checkPermission("category_add"), subAdd);
router.put("/subUpdate/:id", auth, checkPermission("category_add"), subUpdate);
router.get(
  "/subGetallCategories",
  auth,
  checkPermission("category_add"),
  subGetallCategories,
);
router.patch(
  "/subStatus/:id",
  auth,
  checkPermission("category_add"),
  subStatus,
);
router.delete(
  "/subDeleteCategory/:id",
  auth,
  checkPermission("category_add"),
  subDeleteCategory,
);

module.exports = router;
