const requirementModel = require("../models/RequireModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 1800 });

// Create requirement
const addRequirement = async (req, res) => {
  try {
    const savedrequirement = await requirementModel.create(req.body);
    if (savedrequirement) {
      // Send the response first, then handle cache clearing
      res
        .status(201)
        .json({ message: "requirement Added Successfully", savedrequirement });

      // Ensure this is handled safely and won't affect the response
      try {
        cache.del("allrequirements");
      } catch (cacheError) {
        console.error("Error clearing cache:", cacheError.message);
      }
    } else {
      res.status(400).json({ message: "Incomplete requirement Details" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating", error: error.message });
  }
};

// Get all requirements
const getAllRequirement = async (req, res) => {
  try {
    const requirement = await requirementModel.find().lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: requirement, message: "requirement fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get requirement by ID
const getRequirementbyID = async (req, res) => {
  try {
    const id = req.params.id;
    const requirement = await requirementModel.findById(id).lean();
    if (requirement) {
      res
        .status(200)
        .json({ message: "requirement fetched successfully", data: requirement });
    } else {
      res.status(404).json({ message: "requirement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update requirement
const updateRequirement = async (req, res) => {
  const id = req.params.id;
  try {
    const requirementData = await requirementModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res
      .status(200)
      .json({ data: requirementData, message: "requirement updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete requirement
const deleteRequirement = async (req, res) => {
  const id = req.params.id;
  try {
    const requirement = await requirementModel.findByIdAndDelete(id).lean(); // Use .lean()
    if (requirement) {
      res.status(200).json({ data: requirement, message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "requirement not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addRequirement,
  getAllRequirement,
  updateRequirement,
  getRequirementbyID,
  deleteRequirement,
};
