// const express = require("express");
const cloudinary = require("../config/cloudinary");
// const fileupload = require("express-fileupload");
// const mongoose = require("../models/category");
// const router = require("../routes/category");
const Category = require("../models/category");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });
const add = async (req, res) => {
  try {
    let { name, slug, description, status } = req.body;

    console.log("acb");
    if (!name || !slug || !description || !status) {
      return res.send({ status: false, message: "All fields are required" });
    }

    let file = req.files?.image;

    if (!file) {
      return res.send({ status: false, message: "Image is Required" });
    }

    const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Second",
    });

    console.log(uploadImage.url);

    const category = await Category.create({
      name,
      slug,
      description,
      status,
      image: uploadImage.url,
    });

    res.send({ status: true, message: "Category Add Successfully", category });
  } catch (error) {
    console.log(error);
    res.send({ message: error });
  }
};

const update = async (req, res) => {
  try {
    let { id } = req.params;
    const { name, slug, description, status } = req.body;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return res.send({ status: false, message: "User Not Found" });
    }

    category.name = name;
    category.slug = slug;
    category.description = description;
    category.status = status;

    const file = req.files?.image;

    if (file) {
      const updateImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "second",
      });
    }

    await category.save();
    return res.send({ status: true, message: "Category Updated Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getallCategories = async (req, res) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });
    return res.send({
      status: true,
      message: "Category Fetched Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

const status = async (req, res) => {
  try {
    let { id } = req.params;
    let { status } = req.body;

    let selectCategory = await Category.findOne({ _id: id });

    if (!selectCategory) {
      return res.send({ status: false, message: "Invalid Category" });
    }

    selectCategory.status = status;
    await selectCategory.save();
    res.send({
      status: true,
      message: "Status Updated Successfully",
      category: selectCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    let { id } = req.params;

    const category = await Category.deleteOne({ _id: id });

    return res.send({ status: true, message: "Category Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { add, update, getallCategories, status, deleteCategory };
