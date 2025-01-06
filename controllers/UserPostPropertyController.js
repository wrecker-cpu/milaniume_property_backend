const PostPropertyModel = require("../models/UserPostPropertyModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 1800 });

// Create PostProperty
const addPostProperty = async (req, res) => {
  try {
    const savedPostProperty = await PostPropertyModel.create(req.body);
    if (savedPostProperty) {
      // Send the response first, then handle cache clearing
      res
        .status(201)
        .json({ message: "PostProperty Added Successfully", savedPostProperty });

      // Ensure this is handled safely and won't affect the response
      try {
        cache.del("allPostPropertys");
      } catch (cacheError) {
        console.error("Error clearing cache:", cacheError.message);
      }
    } else {
      res.status(400).json({ message: "Incomplete PostProperty Details" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating", error: error.message });
  }
};

// Get all PostPropertys
const getAllPostProperty = async (req, res) => {
  try {
    const PostProperty = await PostPropertyModel.find().lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: PostProperty, message: "PostProperty fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get PostProperty by ID
const getPostPropertybyID = async (req, res) => {
  try {
    const id = req.params.id;
    const PostProperty = await PostPropertyModel.findById(id).lean();
    if (PostProperty) {
      res
        .status(200)
        .json({ message: "PostProperty fetched successfully", data: PostProperty });
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
    const PostPropertyData = await PostPropertyModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res
      .status(200)
      .json({ data: PostPropertyData, message: "PostProperty updated successfully" });
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
      res.status(200).json({ data: PostProperty, message: "Deleted successfully" });
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
};
