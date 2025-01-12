const enquiryModel = require("../models/EnquiryModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const ExcelJS = require("exceljs");
const cache = new NodeCache({ stdTTL: 1800 });

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
const getExcelForEnquiry = async (req, res) => {
  try {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Enquiries");

    // Define columns
    worksheet.columns = [
      { header: "Quick ID No.", key: "QuickIDNo", width: 30 },
      { header: "DATE & TIME", key: "Date&Time", width: 30 },
      { header: "FULL NAME", key: "FullName", width: 20 },
      { header: "EMAIL ID", key: "EmailId", width: 30 },
      { header: "MOBILE NO :", key: "MobileNo", width: 15 },
      { header: "Property Type", key: "PropertyType", width: 20 },
      { header: "Status", key: "Status", width: 15 },
      { header: "Message", key: "Message", width: 70 },
    ];

    // Fetch enquiries from the database
    const enquiries = await enquiryModel.find();

    // Destructure the filters from the query or body (assuming they are sent in query params)
    const { filterBy, approveStatus, year, month } = req.query;

    // Filter the data based on the provided filters
    const filteredData = enquiries.filter((property) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to 00:00:00

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Get yesterday's date
      yesterday.setHours(0, 0, 0, 0); // Normalize yesterday's date to 00:00:00

      const propertyDate = new Date(property?.EnquiryPersonDate);
      propertyDate.setHours(0, 0, 0, 0); // Normalize the property date to 00:00:00

      const isToday =
        propertyDate.getFullYear() === today.getFullYear() &&
        propertyDate.getMonth() === today.getMonth() &&
        propertyDate.getDate() === today.getDate();

      const isYesterday =
        propertyDate.getFullYear() === yesterday.getFullYear() &&
        propertyDate.getMonth() === yesterday.getMonth() &&
        propertyDate.getDate() === yesterday.getDate();

      // Match dates based on the filterBy value (Today, Yesterday, All, or specific year/month)
      const matchesDate =
        filterBy === "Today"
          ? isToday // Show only today's entries
          : filterBy === "Yesterday"
          ? isYesterday // Show only yesterday's entries
          : filterBy === "All" // Show all entries if 'All' filter is selected
          ? true
          : year && !month // Show entries for the selected year, all months
          ? propertyDate.getFullYear() === Number(year)
          : month && year // Show entries for selected month/year
          ? propertyDate >= new Date(year, month - 1, 1) &&
            propertyDate <= new Date(year, month, 0)
          : true; // Show all entries if no filter is selected

      // Filter by approval status (if applicable)
      const matchesStatus =
        approveStatus && approveStatus !== "All"
          ? property.EnquiryStatus === approveStatus
          : true;

      return matchesDate && matchesStatus;
    });

    // Map filtered data to the format for Excel
    const data = filteredData.map((enquiry) => ({
      QuickIDNo: enquiry._id,
      "Date&Time": new Date(enquiry.EnquiryPersonDate).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "medium",
      }),
      FullName: enquiry.EnquiryPersonName,
      EmailId: enquiry.EnquiryPersonEmail,
      MobileNo: enquiry.EnquiryPersonPhone,
      PropertyType: enquiry.EnquiryPropertyType,
      Status: enquiry?.EnquiryStatus === "approved" ? "READ" : "UNREAD",
      Message: enquiry.EnquiryPersonMessage,
    }));

    // Add filtered data rows to the worksheet
    data.forEach((enquiry) => {
      worksheet.addRow(enquiry);
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };

    // Set response headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Enquiries.xlsx");

    // Create a writable stream and pipe the workbook to it
    const writeStream = res;
    await workbook.xlsx.write(writeStream);

    // End the response once the file is written
    res.status(200).end();
  } catch (err) {
    console.error("Error generating Excel file:", err); // Debugging log
    res.status(500).json({
      message: "Error in generating Excel file",
      error: err.message,
    });
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
  getExcelForEnquiry,
};
