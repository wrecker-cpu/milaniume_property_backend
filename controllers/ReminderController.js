const reminderModel = require("../models/ReminderModel");
require("dotenv").config();
const NodeCache = require("node-cache");
const ExcelJS = require("exceljs");
const cache = new NodeCache({ stdTTL: 1800 });

// Create reminder
const addReminder = async (req, res) => {
  try {
    const savedreminder = await reminderModel.create(req.body);
    if (savedreminder) {
      // Send the response first, then handle cache clearing
      res
        .status(201)
        .json({ message: "reminder Added Successfully", savedreminder });

      // Ensure this is handled safely and won't affect the response
      try {
        cache.del("allreminders");
      } catch (cacheError) {
        console.error("Error clearing cache:", cacheError.message);
      }
    } else {
      res.status(400).json({ message: "Incomplete reminder Details" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating", error: error.message });
  }
};
// const getExcelForreminder = async (req, res) => {
//   try {
//     let workbook = new ExcelJS.Workbook();
//     let worksheet = workbook.addWorksheet("Enquiries");

//     // Define columns
//     worksheet.columns = [
//       { header: "Quick ID No.", key: "QuickIDNo", width: 30 },
//       { header: "DATE & TIME", key: "Date&Time", width: 30 },
//       { header: "FULL NAME", key: "FullName", width: 20 },
//       { header: "EMAIL ID", key: "EmailId", width: 30 },
//       { header: "MOBILE NO :", key: "MobileNo", width: 15 },
//       { header: "Property Type", key: "PropertyType", width: 20 },
//       { header: "Status", key: "Status", width: 15 },
//       { header: "Message", key: "Message", width: 70 },
//     ];

//     // Fetch enquiries from the database
//     const enquiries = await reminderModel.find();

//     // Destructure the filters from the query or body (assuming they are sent in query params)
//     const { filterBy, approveStatus, year, month, propertyType } = req.query;

//     // Filter the data based on the provided filters
//     const filteredData = enquiries.filter((property) => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // Normalize today's date to 00:00:00

//       const yesterday = new Date(today);
//       yesterday.setDate(today.getDate() - 1); // Get yesterday's date
//       yesterday.setHours(0, 0, 0, 0); // Normalize yesterday's date to 00:00:00

//       const propertyDate = new Date(property?.reminderPersonDate);
//       propertyDate.setHours(0, 0, 0, 0); // Normalize the property date to 00:00:00

//       const isToday =
//         propertyDate.getFullYear() === today.getFullYear() &&
//         propertyDate.getMonth() === today.getMonth() &&
//         propertyDate.getDate() === today.getDate();

//       const isYesterday =
//         propertyDate.getFullYear() === yesterday.getFullYear() &&
//         propertyDate.getMonth() === yesterday.getMonth() &&
//         propertyDate.getDate() === yesterday.getDate();

//       // Match dates based on the filterBy value (Today, Yesterday, All, or specific year/month)
//       const matchesDate =
//         filterBy === "Today"
//           ? isToday // Show only today's entries
//           : filterBy === "Yesterday"
//           ? isYesterday // Show only yesterday's entries
//           : filterBy === "All" // Show all entries if 'All' filter is selected
//           ? true
//           : year && !month // Show entries for the selected year, all months
//           ? propertyDate.getFullYear() === Number(year)
//           : month && year // Show entries for selected month/year
//           ? propertyDate >= new Date(year, month - 1, 1) &&
//             propertyDate <= new Date(year, month, 0)
//           : true; // Show all entries if no filter is selected

//       // Filter by approval status (if applicable)
//       const matchesStatus =
//         approveStatus && approveStatus !== "All"
//           ? property.reminderStatus === approveStatus
//           : true;

//       const matchesPropertyType =
//         propertyType && propertyType !== "All reminder Type"
//           ? property.reminderPropertyType === propertyType
//           : true;

//       return matchesDate && matchesStatus && matchesPropertyType;
//     });

//     // Map filtered data to the format for Excel
//     const data = filteredData.map((reminder) => ({
//       QuickIDNo: reminder._id,
//       "Date&Time": new Date(reminder.reminderPersonDate).toLocaleString("en-US", {
//         dateStyle: "short",
//         timeStyle: "medium",
//       }),
//       FullName: reminder.reminderPersonName,
//       EmailId: reminder.reminderPersonEmail,
//       MobileNo: reminder.reminderPersonPhone,
//       PropertyType: reminder.reminderPropertyType,
//       Status: reminder?.reminderStatus === "approved" ? "READ" : "UNREAD",
//       Message: reminder.reminderPersonMessage,
//     }));

//     // Add filtered data rows to the worksheet
//     data.forEach((reminder) => {
//       worksheet.addRow(reminder);
//     });

//     // Style header row
//     worksheet.getRow(1).font = { bold: true };

//     // Set response headers for download
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Enquiries.xlsx");

//     // Create a writable stream and pipe the workbook to it
//     const writeStream = res;
//     await workbook.xlsx.write(writeStream);

//     // End the response once the file is written
//     res.status(200).end();
//   } catch (err) {
//     console.error("Error generating Excel file:", err); // Debugging log
//     res.status(500).json({
//       message: "Error in generating Excel file",
//       error: err.message,
//     });
//   }
// };

// Get all reminders
const getAllReminder = async (req, res) => {
  try {
    const reminder = await reminderModel.find().lean().populate("Requirements").populate("Enquiry"); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: reminder, message: "reminder fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAdminReminder = async (req, res) => {
  try {
    const reminder = await reminderModel.find().lean(); // Use .lean() for faster query
    res
      .status(200)
      .json({ data: reminder, message: "reminder fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAllReminders = async (req, res) => {
  try {
    const updatereminder = req.body;
    const result = await reminderModel.updateMany({}, updatereminder);

    res.status(200).json({
      message: "reminders updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating users", error: error.message });
  }
};

// Get reminder by ID
const getReminderbyID = async (req, res) => {
  try {
    const id = req.params.id;
    const reminder = await reminderModel.findById(id).lean();
    if (reminder) {
      res
        .status(200)
        .json({ message: "reminder fetched successfully", data: reminder });
    } else {
      res.status(404).json({ message: "reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

// Update reminder
const updateReminder = async (req, res) => {
  const id = req.params.id;
  try {
    const reminderData = await reminderModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .lean(); // Use .lean()
    res
      .status(200)
      .json({ data: reminderData, message: "reminder updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete reminder
const deleteReminder = async (req, res) => {
  const id = req.params.id;
  try {
    const reminder = await reminderModel.findByIdAndDelete(id).lean(); // Use .lean()
    if (reminder) {
      res.status(200).json({ data: reminder, message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "reminder not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addReminder,
  getAllReminder,
  getAllAdminReminder,
  updateReminder,
  getReminderbyID,
  deleteReminder,
  updateAllReminders,
};
