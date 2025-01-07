const propertyModel = require("../models/PropertyModel");
const enquiryModel = require("../models/EnquiryModel");
const requireModel = require("../models/RequireModel");
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
        cache.del("allAdminpropertys");
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

const getAllProperty = async (req, res) => {
  try {
    let properties = cache.get("allpropertys");
    if (!properties) {
      // Fetch from DB and filter only verified properties
      properties = await propertyModel.find({ Verified: true }).lean();
      cache.set("allpropertys", properties); // Cache the result
    }
    res
      .status(200)
      .json({ data: properties, message: "Properties fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAdminProperty = async (req, res) => {
  try {
    let properties = cache.get("allAdminpropertys");
    if (!properties) {
      properties = await propertyModel.find().lean();
      cache.set("allAdminpropertys", properties); // Cache the result
    }
    res
      .status(200)
      .json({ data: properties, message: "Properties fetched successfully" });
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
    const propertyData = await propertyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ data: propertyData, message: "property updated successfully" });
    cache.del("allpropertys");
    cache.del("allAdminpropertys");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update all properties
const updateAllProperties = async (req, res) => {
  try {
    // Update all properties with the data in req.body
    const updateResult = await propertyModel.updateMany({}, req.body, {
      new: true,
    });

    // Response with the result of the update
    res.status(200).json({
      data: updateResult,
      message: "All properties updated successfully",
    });

    // Clear cache if needed
    cache.del("allpropertys");
    cache.del("allAdminpropertys");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIdsAndDates = async (req, res) => {
  try {
    // Get today's date in ISO format without time
    const today = new Date().toISOString().split("T")[0];

    // Fetch IDs and dates from all models where the date matches today
    const [data1, data2, data3] = await Promise.all([
      propertyModel
        .find(
          {
            PropertyAddedDate: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lt: new Date(`${today}T23:59:59.999Z`),
            },
          },
          { _id: 1, PropertyAddedDate: 1 }
        )
        .lean(),
      enquiryModel
        .find(
          {
            EnquiryPersonDate: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lt: new Date(`${today}T23:59:59.999Z`),
            },
          },
          { _id: 1, EnquiryPersonDate: 1 }
        )
        .lean(),
      requireModel
        .find(
          {
            RequiredPersonDate: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lt: new Date(`${today}T23:59:59.999Z`),
            },
          },
          { _id: 1, RequiredPersonDate: 1 }
        )
        .lean(),
    ]);

    // Standardize the date field names in the response
    const formattedData1 = data1.map((item) => ({
      id: item._id,
      date: item.PropertyAddedDate,
    }));
    const formattedData2 = data2.map((item) => ({
      id: item._id,
      date: item.EnquiryPersonDate,
    }));
    const formattedData3 = data3.map((item) => ({
      id: item._id,
      date: item.RequiredPersonDate,
    }));

    // Combine results into a single response
    res.status(200).json({
      propertyAdded: formattedData1,
      EnquiryAdded: formattedData2,
      RequirementAdded: formattedData3,
      message: "IDs and dates for today fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching IDs and dates for today",
      error: error.message,
    });
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
  getAllAdminProperty,
  getPropertybyID,
  deleteProperty,
  getIdsAndDates,
  updateAllProperties,
};
