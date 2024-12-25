const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  PropertyName: {
    type: String,
    required: true,
  },
  PropertyType: {
    type: String,
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
  Landmark: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  PinCode: {
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
  AllResidential: {
    FlatApartment: { type: Boolean },
    IndependentBuilderFloor: { type: Boolean },
    IndependentHouseVilla: { type: Boolean },
    ResidentialPlot: { type: Boolean },
    FarmHouse: { type: Boolean },
    Other: { type: Boolean },
  },
  AllCommercial: {
    ReadyToMoveOffices: { type: Boolean },
    BareShallOffices: { type: Boolean },
    ShopsRetail: { type: Boolean },
    CommercialInstLand: { type: Boolean },
    Warehouse: { type: Boolean },
    ColdStorage: { type: Boolean },
    Other: { type: Boolean },
  },
  AllIndustrial: {
    WareHouse: { type: Boolean },
    HeavyManufacturing: { type: Boolean },
    LightManufacturing: { type: Boolean },
    DistributionWarehouse: { type: Boolean },
    GeneralWarehouse: { type: Boolean },
    FlexSpace: { type: Boolean },
    ShowroomBuildings: { type: Boolean },
    ResearchAndDevelopment: { type: Boolean },
    DataCenter: { type: Boolean },
  },
  AllPlotLand: {
    ResidentialPlot: { type: Boolean },
    CommercialPlot: { type: Boolean },
    IndustrialPlot: { type: Boolean },
    AgriculturalLand: { type: Boolean },
    NonAgriculturalLand: { type: Boolean },
    WeekendVillaSite: { type: Boolean },
  },
  ResidentialAvailabilityType: {
    LowRiseApartment: { type: Boolean },
    Bungalow: { type: Boolean },
    Penthouse: { type: Boolean },
    RowHouse: { type: Boolean },
    HighRiseApartment: { type: Boolean },
    WeekendVillas: { type: Boolean },
    Tenament: { type: Boolean },
    Building: { type: Boolean },
  },
  CommercialPropertyFeatures: {
    BossCabin: { type: Boolean },
    ManagerCabin: { type: Boolean },
    WorkStation: { type: Boolean },
    Pantry: { type: Boolean },
    Reception: { type: Boolean },
    WaitingArea: { type: Boolean },
    CarParking: { type: Boolean },
  },
  Condition: {
    BuildingSite: { type: Boolean },
    StructuralFrameBuildingEnvelope: { type: Boolean },
    Roofing: { type: Boolean },
    Plumbing: { type: Boolean },
    Heating: { type: Boolean },
    AirConditioningVentilation: { type: Boolean },
    Electrical: { type: Boolean },
    VerticalTransportation: { type: Boolean }, // Elevators & Escalators
    LifeSafetyFireProtection: { type: Boolean },
    InteriorElements: { type: Boolean },
    FullyFurnished: { type: Boolean },
    Furnished: { type: Boolean },
    SemiFurnished: { type: Boolean },
    KitchenFix: { type: Boolean },
    FixFurnished: { type: Boolean },
    Unfurnished: { type: Boolean },
  },
  ResidentAvailable: {
    ForFamily: { type: Boolean },
    ForExecutive: { type: Boolean },
    ForBachlore: { type: Boolean },
  },
  Amenities: {
    WaterSupply247: { type: Boolean },
    SeniorCitizenSitting: { type: Boolean },
    BanquetHall: { type: Boolean },
    HomeTheatre: { type: Boolean },
    IndoorsGame: { type: Boolean },
    OutdoorsGame: { type: Boolean },
    VisitorParking: { type: Boolean },
    AllottedParking: { type: Boolean },
    Lift: { type: Boolean },
    PowerBackup: { type: Boolean },
    GasLine: { type: Boolean },
    SwimmingPool: { type: Boolean },
    Garden: { type: Boolean },
    ChildrenPlayArea: { type: Boolean },
    ClubHouse: { type: Boolean },
    CCTV: { type: Boolean },
  },
  Facing: {
    East: { type: Boolean },
    North: { type: Boolean },
    NorthEast: { type: Boolean },
    NorthWest: { type: Boolean },
    South: { type: Boolean },
    SouthEast: { type: Boolean },
    SouthWest: { type: Boolean },
    West: { type: Boolean },
  },
});

module.exports = mongoose.model("Property", propertySchema); //exporting the model
