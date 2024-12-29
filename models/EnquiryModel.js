const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enquirySchema = new Schema({
  EnquiryPersonName: { type: String, required: true },
  EnquiryPersonEmail: { type: String, required: true },
  EnquiryPersonPhone: { type: String, required: true },
  EnquiryPersonMessage: { type: String, required: true },
  EnquiryPersonDate: { type: Date, default: Date.now },
  EnquiryStatus: {
    type: String,
    enum: ["pending", "overlooked", "approved"],
    default: "pending",
  },
});
module.exports = mongoose.model("Enquiry", enquirySchema); //exporting the model
