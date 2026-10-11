const cloudinary = require("../config/cloudinary");

const SubCategory = require("../models/subcategory");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const subAdd = async (req, res) => {
  try {
    let { name, description, status, parentCategory } = req.body;

    if (!name || !description || !status || !parentCategory) {
      return res.send({ status: false, message: "All fields are required" });
    }

    let file = req.files?.image;

    if (!file) {
      return res.send({ status: false, message: "Image is Required" });
    }

    const slug = generateSlug(name);

    const existingCategory = await SubCategory.findOne({ slug });

    if (existingCategory) {
      return res.send({
        status: false,
        message: "A sub-category with this name is already exist",
      });
    }

    const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Second",
    });

    console.log(uploadImage.url);

    const subcategory = await SubCategory.create({
      name: name.trim(),
      slug,
      description,
      status,
      parentCategory,
      image: uploadImage.url,
    });

    const newSubcategory = await SubCategory.findById(subcategory._id).populate(
      "parentCategory",
      "name",
    );

    res.send({
      status: true,
      message: "Category Add Successfully",
      subcategory: newSubcategory,
    });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Internal server Error" });
  }
};

const subUpdate = async (req, res) => {
  try {
    let { id } = req.params;
    const { name, description, status, parentCategory } = req.body;

    const subcategory = await SubCategory.findOne({ _id: id });

    if (!subcategory) {
      return res.send({ status: false, message: "User Not Found" });
    }

    const slug = generateSlug(name);

    subcategory.name = name;
    subcategory.slug = slug;
    subcategory.description = description;
    subcategory.status = status;
    subcategory.parentCategory = parentCategory;

    const file = req.files?.image;

    if (file) {
      const updateImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "second",
      });

      subcategory.image = updateImage.secure_url;
    }

    await subcategory.save();

    const updatedSubCategory = await SubCategory.findById(id).populate(
      "parentCategory",
      "name",
    );
    return res.send({
      status: true,
      message: "Category Updated Successfully",
      subcategory: updatedSubCategory,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: error });
  }
};

const subGetallCategories = async (req, res) => {
  try {
    const subcategory = await SubCategory.find()
      .populate("parentCategory", "name")
      .sort({ createdAt: -1 });
    return res.send({
      status: true,
      message: "Category Fetched Successfully",
      subcategory,
    });
  } catch (error) {
    console.log(error);
  }
};

const subStatus = async (req, res) => {
  try {
    let { id } = req.params;
    let { status } = req.body;

    let selectCategory = await SubCategory.findOne({ _id: id });

    if (!selectCategory) {
      return res.send({ status: false, message: "Invalid Category" });
    }

    selectCategory.status = status;
    await selectCategory.save();
    res.send({
      status: true,
      message: "Status Updated Successfully",
      subcategory: selectCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

const subDeleteCategory = async (req, res) => {
  try {
    let { id } = req.params;

    const subcategory = await SubCategory.deleteOne({ _id: id });

    return res.send({
      status: true,
      message: "Subcategory Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  subAdd,
  subUpdate,
  subGetallCategories,
  subStatus,
  subDeleteCategory,
};
