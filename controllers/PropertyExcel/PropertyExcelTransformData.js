// transformData.js

const transformResidentData = (filteredData) => {
  return filteredData.map((requirement) => ({
    IdNo: requirement._id,
    DateAndTime: requirement?.PropertyAddedDate,
    PropertyName: requirement?.PropertyName,
    MobileNo: requirement?.ContactDetails.ContactPhone,
    EmailId: requirement?.ContactDetails.ContactEmail,
    Address: requirement?.Address,
    Area: requirement?.Landmark || "N/A",
    "Rent/Buy":
      requirement?.ForSale && requirement?.ForRent
        ? "Sale/Rent"
        : requirement?.ForSale
        ? "Sale"
        : requirement?.ForRent
        ? "Rent"
        : "N/A",

    ConstructionStatus: requirement?.PropertyStatus || "N/A",
    PropertyType: requirement?.PropertyType,
    //Property Bunglow type
    Property:
      Object.keys(requirement.ResidentialAvailabilityType || {}).find(
        (key) => requirement.ResidentialAvailabilityType[key]
      ) || "N/A",
    Condition:
      Object.keys(requirement.Condition || {})
        .filter((key) => requirement.Condition[key])
        .join(", ") || "N/A",

    Availability:
      Object.keys(requirement.BhkScheme || {}).find(
        (key) => requirement.BhkScheme[key]
      ) || "N/A",

    AvailableFor:
      Object.keys(requirement.ResidentAvailable || {}).find(
        (key) => requirement.ResidentAvailable[key]
      ) || "N/A",

    Facing:
      Object.keys(requirement.Facing || {})
        .filter((key) => requirement.Facing[key])
        .join(", ") || "N/A",

    areasqft: `${
      requirement?.PropertyDetails?.Sqft ||
      requirement?.PropertyDetails?.Sqyd ||
      "N/A"
    }`,
    SalesPrice: `${requirement.Prices?.SalesPrice || "N/A"}`,
    RentPrice: `${requirement.Prices?.RentPrice || "N/A"}`,

    Description: requirement?.PropertyDescription || "N/A",
  }));
};

// Similarly, add transform functions for other categories (Commercial, Industrial, etc.)
const transformCommercialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    IdNo: requirement._id,
    DateAndTime: requirement?.PropertyAddedDate,
    PropertyName: requirement?.PropertyName,
    MobileNo: requirement?.ContactDetails.ContactPhone,
    EmailId: requirement?.ContactDetails.ContactEmail,
    Address: requirement?.Address,
    Area: requirement?.Landmark || "N/A",
    "Rent/Buy":
      requirement?.ForSale && requirement?.ForRent
        ? "Sale/Rent"
        : requirement?.ForSale
        ? "Sale"
        : requirement?.ForRent
        ? "Rent"
        : "N/A",

    ConstructionStatus: requirement?.PropertyStatus || "N/A",
    PropertyType: requirement?.PropertyType,
    //Property Bunglow type
    Property:
      Object.keys(requirement.AllCommercial || {}).find(
        (key) => requirement.AllCommercial[key]
      ) || "N/A",
    Condition:
      Object.keys(requirement.Condition || {})
        .filter((key) => requirement.Condition[key])
        .join(", ") || "N/A",

    Facing:
      Object.keys(requirement.Facing || {})
        .filter((key) => requirement.Facing[key])
        .join(", ") || "N/A",

    areasqft: `${
      requirement?.PropertyDetails?.Sqft ||
      requirement?.PropertyDetails?.Sqyd ||
      "N/A"
    }`,
    SalesPrice: `${requirement.Prices?.SalesPrice || "N/A"}`,
    RentPrice: `${requirement.Prices?.RentPrice || "N/A"}`,

    Description: requirement?.PropertyDescription || "N/A",
  }));
};

// transformIndustrialData.js

const transformIndustrialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    IdNo: requirement._id,
    DateAndTime: requirement?.PropertyAddedDate,
    PropertyName: requirement?.PropertyName,
    MobileNo: requirement?.ContactDetails.ContactPhone,
    EmailId: requirement?.ContactDetails.ContactEmail,
    Address: requirement?.Address,
    Area: requirement?.Landmark || "N/A",
    "Rent/Buy":
      requirement?.ForSale && requirement?.ForRent
        ? "Sale/Rent"
        : requirement?.ForSale
        ? "Sale"
        : requirement?.ForRent
        ? "Rent"
        : "N/A",

    ConstructionStatus: requirement?.PropertyStatus || "N/A",
    PropertyType: requirement?.PropertyType,
    //Property Bunglow type
    Property:
      Object.keys(requirement.AllIndustrial || {}).find(
        (key) => requirement.AllIndustrial[key]
      ) || "N/A",
   
    Facing:
      Object.keys(requirement.Facing || {})
        .filter((key) => requirement.Facing[key])
        .join(", ") || "N/A",

    areasqft: `${
      requirement?.PropertyDetails?.Sqft ||
      requirement?.PropertyDetails?.Sqyd ||
      "N/A"
    }`,
    SalesPrice: `${requirement.Prices?.SalesPrice || "N/A"}`,
    RentPrice: `${requirement.Prices?.RentPrice || "N/A"}`,

    Description: requirement?.PropertyDescription || "N/A",
  }));
};

// transformAgricultureData.js

const transformAgricultureData = (filteredData) => {
  return filteredData.map((requirement) => ({
    IdNo: requirement._id,
    DateAndTime: requirement?.PropertyAddedDate,
    PropertyName: requirement?.PropertyName,
    MobileNo: requirement?.ContactDetails.ContactPhone,
    EmailId: requirement?.ContactDetails.ContactEmail,
    Address: requirement?.Address,
    Area: requirement?.Landmark || "N/A",
    "Rent/Buy":
      requirement?.ForSale && requirement?.ForRent
        ? "Sale/Rent"
        : requirement?.ForSale
        ? "Sale"
        : requirement?.ForRent
        ? "Rent"
        : "N/A",

    ConstructionStatus: requirement?.PropertyStatus || "N/A",
    PropertyType: requirement?.PropertyType,
    //Property Bunglow type
    Property:
      Object.keys(requirement.AllPlotLand || {}).find(
        (key) => requirement.AllPlotLand[key]
      ) || "N/A",

    areasqft: `${
      requirement?.PropertyDetails?.Sqft ||
      requirement?.PropertyDetails?.Sqyd ||
      "N/A"
    }`,
    SalesPrice: `${requirement.Prices?.SalesPrice || "N/A"}`,
    RentPrice: `${requirement.Prices?.RentPrice || "N/A"}`,

    Description: requirement?.PropertyDescription || "N/A",
  }));
};

module.exports = {
  transformResidentData,
  transformCommercialData,
  transformIndustrialData,
  transformAgricultureData,
};
