const mongoose = require("mongoose");
const Schema = mongoose.Schema; //creation object of schema class

const reminderSchema = new Schema({
  Name: { type: String },
  MobileNumber: { type: String },
  Email: { type: String },
  "Date&Time": { type: Date },
  PropertyLocation: { type: String },
  Condition: {
    type: String,
  },
  Availability: {
    type: String,
  },
  Budget: {
    type: String,
  },
  PropertyArea: {
    Sqft: { type: String },
    Sqyd: { type: String },
  },
  ReminderType: {
    type: String,
    enum: ["Online", "Offline"],
  },
  Remarks: {
    Visit: { type: Boolean, default: false },
    CallBack: { type: Boolean, default: false },
    Meeting: { type: Boolean, default: false },
    CallNotAnswered: { type: Boolean, default: false },
  },
  Description: { type: String },
  Address: { type: String },
  Enquiry: { type: Schema.Types.ObjectId, ref: "Enquiry", default: null },
  Requirements: { type: Schema.Types.ObjectId, ref: "Requirement", default: null },
});

module.exports = mongoose.model("Reminder", reminderSchema); //exporting the model
