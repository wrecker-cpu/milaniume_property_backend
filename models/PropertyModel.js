const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  PropertyName: {
    type: String,
    required: true,
  },
  PropertyType: {
    type: [String],
    enum: [
      "Commercial",
      "Residential",
      "Industrial",
      "Agricultural Plot",
      "Rental Property",
    ],
  },
  ForSale: {
    type: Boolean,
    default: true,
  },
  ForRent: {
    type: Boolean,
    default: false,
  },
  Featured: {
    type: Boolean,
    default: false,
  },
  Prices: {
    SalesPrice: { type: String },
    RentPrice: { type: String },
  },
  PropertyDetails: {
    Bedrooms: { type: Number },
    Bathrooms: { type: Number },
    Sqft: { type: String },
  },
  PropertyPhotos: {
    type: [String], // Array to store URLs of property photos
    default: [], // Default to an empty array
  },
  Area: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  ContactDetails: {
    ContactEmail: { type: String },
    ContactPhone: { type: String },
  },
});

module.exports = mongoose.model("Property", propertySchema); //exporting the model
