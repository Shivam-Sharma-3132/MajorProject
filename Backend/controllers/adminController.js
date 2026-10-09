const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    let existUser = await User.findOne({ email });

    if (existUser) {
      return res.send({ status: false, message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    let createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.send({ status: true, message: "User Creasted Successfuly" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let verifyUser = await User.findOne({ email });

    if (!verifyUser) {
      return res.send({ status: false, message: "User Not Found" });
    }

    const verifyPassword = await bcrypt.compare(password, verifyUser.password);

    if (!verifyPassword) {
      return res.send({ status: false, message: "Wrong Password" });
    }

    let token = await jwt.sign(
      { email: verifyUser.email, id: verifyUser._id },
      "MySecretKey",
      // { expiresIn: "10m" },
    );

    console.log(token);
    res.send({ status: true, message: "Valid Password", token });
  } catch (error) {
    console.log(error);
  }
};

const forget = async (req, res) => {
  try {
    let { email } = req.body;

    let checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.send({ status: false, message: "User not Found" });
    }

    let code = Math.floor(100000 + Math.random() * 900000);

    checkUser.otp = code;
    await checkUser.save();

    const info = await transport.sendMail({
      from: process.env.GMAIL_USER,
      to: checkUser.email,
      subject: "Verify OTP",
      html: `<h1>Your 6-dig OTP is ${code}</h1>`,
    });

    res.send({ status: true, message: "Otp Send Successfully" });

    console.log(info);
  } catch (error) {
    console.log(error);
  }
};

const otp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.send({ status: false, message: "User Not Found" });
    }

    if (findUser.otp !== otp) {
      return res.send({ status: false, message: "Invalid Otp" });
    }

    res.send({ status: true, message: "Valid Otp" });
  } catch (error) {
    console.log(error);
  }
};

const reset = async (req, res) => {
  try {
    let { email, password } = req.body;

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.send({ status: false, message: "User not Found" });
    }

    const hashedPasswordAgain = await bcrypt.hash(password, 8);

    checkUser.password = hashedPasswordAgain;
    await checkUser.save();

    res.send({ status: true, message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
  }
};

// USER ADD USING ADMINLAYOUT

const add = async (req, res) => {
  try {
    let { name, email, phone, address } = req.body;

    let findUser = await User.findOne({ email });

    if (findUser) {
      return res.send({ status: false, message: "User Already Exist" });
    }

    let createUser = await User.create({
      name,
      email,
      phone,
      address,
    });

    return res.send({
      status: true,
      message: "User created successfully",
      user: createUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    let { id } = req.params;

    let { name, email, phone, address, status } = req.body;

    let findUser = await User.findOne({ _id: id });

    if (!findUser) {
      return res.send({ status: false, message: "User not Found" });
    }

    findUser.name = name;
    findUser.email = email;
    findUser.phone = phone;
    findUser.address = address;
    findUser.status = status;

    const updateUser = await findUser.save();

    return res.send({
      status: true,
      message: "User Updated Successfully",
      user: updateUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAll = async (req, res) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    return res.send({ status: true, message: "All User Found", user });
  } catch (error) {
    console.log(error);
  }
};

const status = async (req, res) => {
  try {
    let { id } = req.params;
    let { status } = req.body;

    let selectUser = await User.findOne({ _id: id });

    if (!selectUser) {
      return res.send({ status: false, message: "User not Found" });
    }

    selectUser.status = status;

    await selectUser.save();
    res.send({
      status: true,
      message: "Status Updated Successfully",
      user: selectUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  try {
    res.send({ status: true, message: "Valid Token" });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    let { id } = req.params;

    let deleteUser = await User.deleteOne({ _id: id });

    if (deleteUser.deletedCount === 0) {
      return res.send({ status: false, message: "User Not Found" });
    }

    res.send({ status: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  forget,
  otp,
  reset,
  add,
  update,
  getAll,
  status,
  verify,
  deleteUser,
};
