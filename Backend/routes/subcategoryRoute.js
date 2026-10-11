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

router.post("/subAdd", auth, checkPermission("subcategory_add"), subAdd);
router.put(
  "/subUpdate/:id",
  auth,
  checkPermission("subcategory_update"),
  subUpdate,
);
router.get(
  "/subGetallCategories",
  auth,
  checkPermission("subcategory_read"),
  subGetallCategories,
);
router.patch(
  "/subStatus/:id",
  auth,
  checkPermission("subcategory_update"),
  subStatus,
);
router.delete(
  "/subDeleteCategory/:id",
  auth,
  checkPermission("subcategory_delete"),
  subDeleteCategory,
);

module.exports = router;
