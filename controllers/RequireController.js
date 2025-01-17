const requirementModel = require("../models/RequireModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const ExcelJS = require("exceljs");
const cache = new NodeCache({ stdTTL: 1800 });
const {
  excelResidentColumns,
  excelCommercialColumns,
  excelIndustrialColumns,
  excelAgricultureColumns,
} = require("./RequirementExcel/RequirementPropertyExcelColumns");
const {
  transformResidentData,
  transformCommercialData,
  transformIndustrialData,
  transformAgricultureData,
} = require("./RequirementExcel/RequirementPropertyExcelTransformData");

// const transformResidentData = (filteredData) => {
//   return filteredData.map((requirement) => ({
//     RequirementIdNo: requirement._id,
//     DateAndTime: requirement.RequiredPersonDate,
//     Role: requirement.RequiredPersonRole,
//     FullName: requirement.RequiredPersonName,
//     MobileNo: requirement.RequiredPersonPhone,
//     EmailId: requirement.RequiredPersonEmail,
//     RequirementArea:
//       requirement.RequiredPropertyDetails?.RequirementArea || "N/A",
//     "Rent/Buy": requirement.RequiredPropertyDetails?.RequiredPropertySellOrRent,
//     LookingFor:
//       Object.keys(requirement.ResidentialAvailability || {}).find(
//         (key) => requirement.ResidentialAvailability[key]
//       ) || "N/A",
//     PropertyType: requirement.RequiredPropertyDetails?.RequiredPropertyType,
//     ConstructionStatus:
//       requirement.RequiredPropertyDetails?.RequiredConstructionStatus || "N/A",
//     Condition:
//       Object.keys(requirement.Condition || {})
//         .filter((key) => requirement.Condition[key])
//         .join(", ") || "N/A",
//     Facing:
//       Object.keys(requirement.Facing || {})
//         .filter((key) => requirement.Facing[key])
//         .join(", ") || "N/A",
//     Availability: [
//       ...Object.keys(requirement.ResidentialAvailability || {}).filter(
//         (key) => requirement.ResidentialAvailability[key]
//       ),
//       ...Object.keys(requirement.CommercialAvailability || {}).filter(
//         (key) => requirement.CommercialAvailability[key]
//       ),
//     ].join(", ") || "N/A",
//     areasqft:
//       `${requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min || "N/A"} - ${
//         requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max || "N/A"
//       }`,
//     MinBudget:
//       `${requirement.RequiredPropertyDetails?.RequiredBudget?.min || "N/A"}`,
//     MaxBudget:
//       `${requirement.RequiredPropertyDetails?.RequiredBudget?.max || "N/A"}`,
//     Description:
//       requirement.RequiredPropertyDetails?.RequiredDescription || "N/A",
//   }));
// };

// const excelResidentColumns= [
//   { header: "REQUIREMENT ID NO:", key: "RequirementIdNo", width: 30 },
//   { header: "DATE & TIME:", key: "DateAndTime", width: 20 },
//   { header: "ROLE", key: "Role", width: 20 },
//   { header: "FULL NAME", key: "FullName", width: 30 },
//   { header: "MOBILE NO :", key: "MobileNo", width: 15 },
//   { header: "EMAILID", key: "EmailId", width: 30 },
//   { header: "REQUIREMENTAREA", key: "RequirementArea", width: 20 },
//   { header: "Rent/Buy", key: "Rent/Buy", width: 10 },
//   { header: "LOOKING FOR", key: "LookingFor", width: 20 },
//   { header: "Property Type", key: "PropertyType", width: 20 },
//   { header: "CONSTRUCTION STATUS", key: "ConstructionStatus", width: 20 },
//   { header: "AVAILABILITY", key: "Availability", width: 15 },
//   { header: "FACING", key: "Facing", width: 20 },
//   { header: "CONDITION", key: "Condition", width: 30 },
//   { header: "AREA (SQFT/SQYD) - Min to Max", key: "areasqft", width: 30 },
//   { header: "Min Budget", key: "MinBudget", width: 15 },
//   { header: "Max Budget", key: "MaxBudget", width: 15 },
//   { header: "DESCRIPTION ", key: "Description", width: 20 },
// ];

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
    const requirement = await requirementModel
      .find({ RecycleBin: false })
      .lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: requirement, message: "requirement fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAdminRequirement = async (req, res) => {
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
      res.status(200).json({
        message: "requirement fetched successfully",
        data: requirement,
      });
    } else {
      res.status(404).json({ message: "requirement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

const getExcelForRequirement = async (req, res) => {
  try {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Requirements");
    const { filterBy, year, month, propertyType } = req.query;
    let excelColumns;
    let transformData;

    switch (propertyType) {
      case "Residential":
        excelColumns = excelResidentColumns;
        transformData = transformResidentData;
        break;
      case "Commercial":
        excelColumns = excelCommercialColumns;
        transformData = transformCommercialData;
        break;
      case "Industrial":
        excelColumns = excelIndustrialColumns;
        transformData = transformIndustrialData;
        break;
      case "Agriculture":
        excelColumns = excelAgricultureColumns;
        transformData = transformAgricultureData;
        break;
      default:
        return res.status(400).json({ message: "Invalid PropertyType" });
    }

    // Define columns based on the new schema
    worksheet.columns = excelColumns;

    // Fetch requirements from the database
    const requirements = await requirementModel.find();

    // Destructure the filters from the query or body (assuming they are sent in query params)

    // Filter the data based on the provided filters
    const filteredData = requirements.filter((requirement) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to 00:00:00

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Get yesterday's date
      yesterday.setHours(0, 0, 0, 0); // Normalize yesterday's date to 00:00:00

      const requirementDate = new Date(requirement.RequiredPersonDate);
      requirementDate.setHours(0, 0, 0, 0); // Normalize the requirement date to 00:00:00

      const isToday =
        requirementDate.getFullYear() === today.getFullYear() &&
        requirementDate.getMonth() === today.getMonth() &&
        requirementDate.getDate() === today.getDate();

      const isYesterday =
        requirementDate.getFullYear() === yesterday.getFullYear() &&
        requirementDate.getMonth() === yesterday.getMonth() &&
        requirementDate.getDate() === yesterday.getDate();

      // Match dates based on the filterBy value (Today, Yesterday, All, or specific year/month)
      const matchesDate =
        filterBy === "Today"
          ? isToday
          : filterBy === "Yesterday"
          ? isYesterday
          : filterBy === "All"
          ? true
          : year && !month
          ? requirementDate.getFullYear() === Number(year)
          : month && year
          ? requirementDate >= new Date(year, month - 1, 1) &&
            requirementDate <= new Date(year, month, 0)
          : true;

      const matchesPropertyType = propertyType
        ? requirement.RequiredPropertyDetails?.RequiredPropertyType ===
          propertyType
        : true;

      return matchesDate && matchesPropertyType;
    });

    // Map filtered data to the format for Excel
    const data = transformData(filteredData);

    // Add filtered data rows to the worksheet
    data.forEach((requirement) => {
      worksheet.addRow(requirement);
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };

    // Set response headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Requirements.xlsx"
    );

    // Create a writable stream and pipe the workbook to it
    const writeStream = res;
    await workbook.xlsx.write(writeStream);

    // End the response once the file is written
    res.status(200).end();
  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).json({
      message: "Error in generating Excel file",
      error: err.message,
    });
  }
};

// Update requirement
const updateRequirement = async (req, res) => {
  const id = req.params.id;
  try {
    const requirementData = await requirementModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res.status(200).json({
      data: requirementData,
      message: "requirement updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAllRequirement = async (req, res) => {
  try {
    // Update all properties with the data in req.body
    const updateResult = await requirementModel.updateMany({}, req.body, {
      new: true,
    });

    // Response with the result of the update
    res.status(200).json({
      data: updateResult,
      message: "All Requirement updated successfully",
    });

    // Clear cache if needed
    cache.del("allrequirements");
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
      res
        .status(200)
        .json({ data: requirement, message: "Deleted successfully" });
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
  updateAllRequirement,
  getExcelForRequirement,
  getAllAdminRequirement
};
