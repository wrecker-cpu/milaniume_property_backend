const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Role: { type: String, enum: ["Owner", "Agent", "Builder"] },
  Fullname: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Phone: { type: String },
  AltPhone: { type: String },
  UserPostAdded: { type: Date, default: Date.now },
  PostedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }], // Reference to properties
});

module.exports = mongoose.model("UserPost", userSchema);
