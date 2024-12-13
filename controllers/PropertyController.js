const propertyModel = require("../models/PropertyModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 1800 });

// Create property
const addProperty = async (req, res) => {
  try {
    const savedProperty = await propertyModel.create(req.body);
    if (savedProperty) {
      // Send the response first, then handle cache clearing
      res
        .status(201)
        .json({ message: "Property Added Successfully", savedProperty });

      // Ensure this is handled safely and won't affect the response
      try {
        cache.del("allpropertys");
      } catch (cacheError) {
        console.error("Error clearing cache:", cacheError.message);
      }
    } else {
      res.status(400).json({ message: "Incomplete Property Details" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating", error: error.message });
  }
};

// Get all propertys
const getAllProperty = async (req, res) => {
  try {
    const property = await propertyModel.find().lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: property, message: "Property fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get property by ID
const getPropertybyID = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await propertyModel.findById(id).lean();
    if (property) {
      res
        .status(200)
        .json({ message: "property fetched successfully", data: property });
    } else {
      res.status(404).json({ message: "property not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update property
const updateProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const propertyData = await propertyModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res
      .status(200)
      .json({ data: propertyData, message: "property updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const property = await propertyModel.findByIdAndDelete(id).lean(); // Use .lean()
    if (property) {
      res.status(200).json({ data: property, message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "property not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProperty,
  getAllProperty,
  updateProperty,
  getPropertybyID,
  deleteProperty,
};
