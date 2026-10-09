require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();

    console.log("SUCCESS:", result);
  } catch (error) {
    console.log("ERROR MESSAGE:", error.message);
    console.log("ERROR NAME:", error.name);
    console.log("ERROR HTTP CODE:", error.http_code);
    console.log("ERROR DETAILS:", error.error);
    console.log("FULL ERROR:", error);
  }
}

testCloudinary();
