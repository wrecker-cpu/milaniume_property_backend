const PostPropertyModel = require("../models/UserPostPropertyModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const ExcelJS = require("exceljs");
const cache = new NodeCache({ stdTTL: 1800 });

// Create PostProperty
const addPostProperty = async (req, res) => {
  try {
    const { Email, PostedProperties, ...otherUpdateData } = req.body; // Extract email, PostedProperties, and other data from the request body

    // Check if a post property already exists with the given email
    const existingPostProperty = await PostPropertyModel.findOne({
      Email: { $regex: `^${Email}$`, $options: "i" },
    });

    if (existingPostProperty) {
      // Update the existing record by adding all new properties in the PostedProperties array
      const updatedPostProperty = await PostPropertyModel.findOneAndUpdate(
        { Email },
        {
          ...otherUpdateData,
          $push: { PostedProperties: { $each: PostedProperties } },
        },
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        message: "PostProperty updated successfully",
        updatedPostProperty,
      });
    } else {
      // Create a new record if none exists
      const savedPostProperty = await PostPropertyModel.create(req.body);

      if (savedPostProperty) {
        res.status(201).json({
          message: "PostProperty Added Successfully",
          savedPostProperty,
        });

        // Clear the cache
        try {
          cache.del("allPostPropertys");
        } catch (cacheError) {
          console.error("Error clearing cache:", cacheError.message);
        }
      } else {
        res.status(400).json({ message: "Incomplete PostProperty Details" });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in creating or updating",
      error: error.message,
    });
  }
};

// Get all PostPropertys
const getAllPostProperty = async (req, res) => {
  try {
    const PostProperty = await PostPropertyModel.find()
      .lean()
      .populate("PostedProperties"); // Use .lean() for faster query
    res.status(200).json({
      data: PostProperty,
      message: "PostProperty fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExcelForUserPosts = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Posts");

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: "Role", key: "Role", width: 20 },
      { header: "Full Name", key: "Fullname", width: 30 },
      { header: "Email", key: "Email", width: 30 },
      { header: "Phone", key: "Phone", width: 15 },
      { header: "Alternate Phone", key: "AltPhone", width: 15 },
      { header: "Posted Properties", key: "PostedProperties", width: 50 },
    ];

    // Fetch user data from the database
    const users = await PostPropertyModel.find().populate("PostedProperties");

    // Map user data to the Excel worksheet rows
    users.forEach((user) => {
      // Add a row for the user without property details
      worksheet.addRow({
        Role: user.Role || "N/A",
        Fullname: user.Fullname,
        Email: user.Email,
        Phone: user.Phone || "N/A",
        AltPhone: user.AltPhone || "N/A",
        PostedProperties: "", // Leave empty for user row
      });

      // Add a row for each property the user has posted
      user.PostedProperties.forEach((property) => {
        worksheet.addRow({
          Role: "", // Leave empty for property rows
          Fullname: "", // Leave empty for property rows
          Email: "", // Leave empty for property rows
          Phone: "", // Leave empty for property rows
          AltPhone: "", // Leave empty for property rows
          PostedProperties: `ID: ${property._id || "N/A"}, Name: ${
            property.PropertyName || "N/A"
          }, Type: ${property.PropertyType || "N/A"}, Sale Price: ${
            property.Prices?.SalesPrice || "N/A"
          }, Rent Price: ${property.Prices?.RentPrice || "N/A"}`,
        });
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };

    // Set the response headers to trigger a file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=UserPosts.xlsx");

    // Write the Excel file to the response stream
    const writeStream = res;
    await workbook.xlsx.write(writeStream);

    // End the response
    res.status(200).end();
  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).json({
      message: "Error generating Excel file",
      error: err.message,
    });
  }
};

// Get PostProperty by ID
const getPostPropertybyID = async (req, res) => {
  try {
    const id = req.params.id;
    const PostProperty = await PostPropertyModel.findById(id).lean();
    if (PostProperty) {
      res.status(200).json({
        message: "PostProperty fetched successfully",
        data: PostProperty,
      });
    } else {
      res.status(404).json({ message: "PostProperty not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update PostProperty
const updatePostProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const PostPropertyData = await PostPropertyModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).lean(); // Use .lean()
    res.status(200).json({
      data: PostPropertyData,
      message: "PostProperty updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete PostProperty
const deletePostProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const PostProperty = await PostPropertyModel.findByIdAndDelete(id).lean(); // Use .lean()
    if (PostProperty) {
      res
        .status(200)
        .json({ data: PostProperty, message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "PostProperty not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addPostProperty,
  getAllPostProperty,
  updatePostProperty,
  getPostPropertybyID,
  deletePostProperty,
  getExcelForUserPosts,
};
