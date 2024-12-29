const enquiryModel = require("../models/EnquiryModel");
require("dotenv").config();
// const NodeCache = require("node-cache");
// const cache = new NodeCache({ stdTTL: 1800 });

// Create enquiry
const addEnquiry = async (req, res) => {
  try {
    const savedenquiry = await enquiryModel.create(req.body);
    if (savedenquiry) {
      // Send the response first, then handle cache clearing
      res
        .status(201)
        .json({ message: "enquiry Added Successfully", savedenquiry });

      // Ensure this is handled safely and won't affect the response
      try {
        cache.del("allenquirys");
      } catch (cacheError) {
        console.error("Error clearing cache:", cacheError.message);
      }
    } else {
      res.status(400).json({ message: "Incomplete enquiry Details" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating", error: error.message });
  }
};

// Get all enquirys
const getAllEnquiry = async (req, res) => {
  try {
    const enquiry = await enquiryModel.find().lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: enquiry, message: "enquiry fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get enquiry by ID
const getEnquirybyID = async (req, res) => {
  try {
    const id = req.params.id;
    const enquiry = await enquiryModel.findById(id).lean();
    if (enquiry) {
      res
        .status(200)
        .json({ message: "enquiry fetched successfully", data: enquiry });
    } else {
      res.status(404).json({ message: "enquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update enquiry
const updateEnquiry = async (req, res) => {
  const id = req.params.id;
  try {
    const enquiryData = await enquiryModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res
      .status(200)
      .json({ data: enquiryData, message: "enquiry updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete enquiry
const deleteEnquiry = async (req, res) => {
  const id = req.params.id;
  try {
    const enquiry = await enquiryModel.findByIdAndDelete(id).lean(); // Use .lean()
    if (enquiry) {
      res.status(200).json({ data: enquiry, message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "enquiry not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addEnquiry,
  getAllEnquiry,
  updateEnquiry,
  getEnquirybyID,
  deleteEnquiry,
};
