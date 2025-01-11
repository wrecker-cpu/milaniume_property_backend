const propertyModel = require("../models/PropertyModel");
const enquiryModel = require("../models/EnquiryModel");
const requireModel = require("../models/RequireModel");
require("dotenv").config();
const ExcelJS = require("exceljs");
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

const getExcelForProperties = async (req, res) => {
  try {
    const { filterBy,approveStatus, year, month } = req.query;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Properties");

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: "Property Name", key: "PropertyName", width: 20 },
      { header: "Property Type", key: "PropertyType", width: 20 },
      { header: "Verified", key: "Verified", width: 30 },
      { header: "For Sale", key: "ForSale", width: 10 },
      { header: "For Rent", key: "ForRent", width: 10 },
      { header: "Prices", key: "Prices", width: 20 },
      { header: "Address", key: "Address", width: 30 },
      { header: "City", key: "City", width: 15 },
      { header: "Condition", key: "Condition", width: 50 },
      { header: "Amenities", key: "Amenities", width: 50 },
      { header: "All Residential", key: "AllResidential", width: 50 },
      { header: "All Commercial", key: "AllCommercial", width: 50 },
      { header: "All Industrial", key: "AllIndustrial", width: 50 },
      { header: "All Plot Land", key: "AllPlotLand", width: 50 },
      { header: "Facing", key: "Facing", width: 30 },
      { header: "BHK Scheme", key: "BhkScheme", width: 50 },
      {
        header: "Residential Availability",
        key: "ResidentialAvailabilityType",
        width: 50,
      },
      { header: "Resident Available", key: "ResidentAvailable", width: 50 },
      {
        header: "Commercial Features",
        key: "CommercialPropertyFeatures",
        width: 50,
      },
      { header: "Property Description", key: "PropertyDescription", width: 50 },
    ];

    // Fetch property data from the database
    const properties = await propertyModel.find();

    // Apply filtering logic
    const filteredData = properties.filter((property) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to 00:00:00

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Get yesterday's date
      yesterday.setHours(0, 0, 0, 0); // Normalize yesterday's date to 00:00:00

      const propertyDate = new Date(property?.PropertyAddedDate);
      propertyDate.setHours(0, 0, 0, 0); // Normalize the property date to 00:00:00

      const isToday =
        propertyDate.getFullYear() === today.getFullYear() &&
        propertyDate.getMonth() === today.getMonth() &&
        propertyDate.getDate() === today.getDate();

      const isYesterday =
        propertyDate.getFullYear() === yesterday.getFullYear() &&
        propertyDate.getMonth() === yesterday.getMonth() &&
        propertyDate.getDate() === yesterday.getDate();

      // Match dates based on the filterBy value
      const matchesDate =
        filterBy === "Today"
          ? isToday
          : filterBy === "Yesterday"
          ? isYesterday
          : filterBy === "All"
          ? true
          : year && !month
          ? propertyDate.getFullYear() === Number(year)
          : month && year
          ? propertyDate >= new Date(year, month - 1, 1) &&
            propertyDate <= new Date(year, month, 0)
          : true;

      const matchesType =
        approveStatus && approveStatus !== "unverified"
          ? property?.Verified
          : !property?.Verified;

      return matchesDate && matchesType;
    });

    // Map filtered property data to the Excel worksheet rows
    filteredData.forEach((property) => {
      worksheet.addRow({
        PropertyName: property.PropertyName || "N/A",
        PropertyType: property.PropertyType || "N/A",
        Verified:
          property.Verified === true ? "verified" : "notVerified" || "N/A",
        ForSale: property.ForSale ? "Yes" : "No",
        ForRent: property.ForRent ? "Yes" : "No",
        Prices: `Sales: ${property.Prices?.SalesPrice || "N/A"}, Rent: ${
          property.Prices?.RentPrice || "N/A"
        }`,
        Address: property.Address || "N/A",
        City: property.City || "N/A",
        Condition: Object.keys(property.Condition || {})
          .filter((key) => property.Condition[key])
          .join(" , "),
        Amenities: Object.keys(property.Amenities || {})
          .filter((key) => property.Amenities[key])
          .join(" , "),
        AllResidential: Object.keys(property.AllResidential || {})
          .filter((key) => property.AllResidential[key])
          .join(" , "),
        AllCommercial: Object.keys(property.AllCommercial || {})
          .filter((key) => property.AllCommercial[key])
          .join(" , "),
        AllIndustrial: Object.keys(property.AllIndustrial || {})
          .filter((key) => property.AllIndustrial[key])
          .join(" , "),
        AllPlotLand: Object.keys(property.AllPlotLand || {})
          .filter((key) => property.AllPlotLand[key])
          .join(" , "),
        Facing: Object.keys(property.Facing || {})
          .filter((key) => property.Facing[key])
          .join(" , "),
        BhkScheme: Object.keys(property.BhkScheme || {})
          .filter((key) => property.BhkScheme[key])
          .join(" , "),
        ResidentialAvailabilityType: Object.keys(
          property.ResidentialAvailabilityType || {}
        )
          .filter((key) => property.ResidentialAvailabilityType[key])
          .join(" , "),
        ResidentAvailable: Object.keys(property.ResidentAvailable || {})
          .filter((key) => property.ResidentAvailable[key])
          .join(" , "),
        CommercialPropertyFeatures: Object.keys(
          property.CommercialPropertyFeatures || {}
        )
          .filter((key) => property.CommercialPropertyFeatures[key])
          .join(" , "),
        PropertyDescription: property.PropertyDescription || "N/A",
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };

    // Set the response headers to trigger a file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Properties.xlsx"
    );

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

const getAllProperty = async (req, res) => {
  try {
    let properties = cache.get("allpropertys");
    if (!properties) {
      // Fetch from DB and filter only verified properties
      properties = await propertyModel
        .find({ Verified: true, RecycleBin: false })
        .lean();
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

const getPropertyAsPerType = async (req, res) => {
  try {
    // Aggregate property counts grouped by PropertyType
    const propertyCounts = await propertyModel.aggregate([
      {
        $group: {
          _id: "$PropertyType",
          total: { $sum: 1 },
        },
      },
    ]);

    // Format the response to return the property counts
    const formattedPropertyCounts = propertyCounts.map((item) => ({
      propertyType: item._id,
      total: item.total,
    }));

    res.status(200).json({
      data: {
        propertyCounts: formattedPropertyCounts,
      },
      message: "Property counts per type fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching property counts per type",
      error: error.message,
    });
  }
};

const getIdsAndDates = async (req, res) => {
  try {
    // Get today's date in ISO format without time
    const today = new Date().toISOString().split("T")[0];

    // Fetch IDs, dates, and counts from all models where the date matches today
    const [data1, data2, data3, count1, count2, count3] = await Promise.all([
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
      propertyModel.countDocuments(),
      enquiryModel.countDocuments(),
      requireModel.countDocuments(),
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
      data: {
        propertyAdded: {
          today: formattedData1,
          total: count1,
        },
        enquiryAdded: {
          today: formattedData2,
          total: count2,
        },
        requirementAdded: {
          today: formattedData3,
          total: count3,
        },
      },
      message: "IDs, dates, and total counts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching IDs, dates, and total counts",
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
  getPropertyAsPerType,
  getExcelForProperties,
};
