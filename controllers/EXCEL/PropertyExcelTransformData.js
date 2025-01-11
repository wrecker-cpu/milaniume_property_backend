// transformData.js

const transformResidentData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: requirement.RequiredPersonDate,
    Role: requirement.RequiredPersonRole,
    FullName: requirement.RequiredPersonName,
    MobileNo: requirement.RequiredPersonPhone,
    EmailId: requirement.RequiredPersonEmail,
    RequirementArea:
      requirement.RequiredPropertyDetails?.RequirementArea || "N/A",
    "Rent/Buy": requirement.RequiredPropertyDetails?.RequiredPropertySellOrRent,
    LookingFor:
      Object.keys(requirement.AllResidential || {}).find(
        (key) => requirement.AllResidential[key]
      ) || "N/A",
    PropertyType: requirement.RequiredPropertyDetails?.RequiredPropertyType,
    ConstructionStatus:
      requirement.RequiredPropertyDetails?.RequiredConstructionStatus || "N/A",
    Availability:
      Object.keys(requirement.ResidentialAvailability || {}).find(
        (key) => requirement.ResidentialAvailability[key]
      ) || "N/A",
    FORUSE:
      Object.keys(requirement.ResidentAvailableFor || {}).find(
        (key) => requirement.ResidentAvailableFor[key]
      ) || "N/A",
    Facing:
      Object.keys(requirement.Facing || {})
        .filter((key) => requirement.Facing[key])
        .join(", ") || "N/A",
    Condition:
      Object.keys(requirement.Condition || {})
        .filter((key) => requirement.Condition[key])
        .join(", ") || "N/A",
    areasqft: `${
      requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min || "N/A"
    } - ${requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max || "N/A"}`,
    MinBudget: `${
      requirement.RequiredPropertyDetails?.RequiredBudget?.min || "N/A"
    }`,
    MaxBudget: `${
      requirement.RequiredPropertyDetails?.RequiredBudget?.max || "N/A"
    }`,
    Description:
      requirement.RequiredPropertyDetails?.RequiredDescription || "N/A",
  }));
};

// Similarly, add transform functions for other categories (Commercial, Industrial, etc.)
const transformCommercialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: requirement.RequiredPersonDate,
    Role: requirement.RequiredPersonRole,
    FullName: requirement.RequiredPersonName,
    MobileNo: requirement.RequiredPersonPhone,
    EmailId: requirement.RequiredPersonEmail,
    RequirementArea:
      requirement.RequiredPropertyDetails.RequirementArea || "N/A",
    "Rent/Buy": requirement.RequiredPropertyDetails.RequiredPropertySellOrRent,
    LookingFor:
      Object.keys(requirement.AllCommercial).find(
        (key) => requirement.AllCommercial[key]
      ) || "N/A",
    PropertyType: requirement.RequiredPropertyDetails.RequiredPropertyType,
    ConstructionStatus:
      requirement.RequiredPropertyDetails.RequiredConstructionStatus || "N/A",
    Facing:
      Object.keys(requirement.Facing)
        .filter((key) => requirement.Facing[key])
        .join(", ") || "N/A", // Added fallback for empty Facing keys
    Condition:
      Object.keys(requirement.Condition || {})
        .filter((key) => requirement.Condition[key])
        .join(", ") || "N/A",
    areasqft: `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} - ${requirement.RequiredPropertyDetails.RequiredAreaSqft.max}`,
    MinBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.min}`,
    MaxBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.max}`,
    Description:
      requirement.RequiredPropertyDetails.RequiredDescription || "N/A",
  }));
};

// transformIndustrialData.js

const transformIndustrialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: requirement.RequiredPersonDate,
    Role: requirement.RequiredPersonRole,
    FullName: requirement.RequiredPersonName,
    MobileNo: requirement.RequiredPersonPhone,
    EmailId: requirement.RequiredPersonEmail,
    RequirementArea:
      requirement.RequiredPropertyDetails.RequirementArea || "N/A",
    "Rent/Buy": requirement.RequiredPropertyDetails.RequiredPropertySellOrRent,
    LookingFor:
      Object.keys(requirement.AllIndustrial).find(
        (key) => requirement.AllIndustrial[key]
      ) || "N/A",
    PropertyType: requirement.RequiredPropertyDetails.RequiredPropertyType,
    ConstructionStatus:
      requirement.RequiredPropertyDetails.RequiredConstructionStatus || "N/A",
    Facing: Object.keys(requirement.Facing)
      .filter((key) => requirement.Facing[key])
      .join(", "),
    areasqft: `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} - ${requirement.RequiredPropertyDetails.RequiredAreaSqft.max}`,
    MinBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.min}`,
    MaxBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.max}`,
    Description:
      requirement.RequiredPropertyDetails.RequiredDescription || "N/A",
  }));
};

// transformAgricultureData.js

const transformAgricultureData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: requirement.RequiredPersonDate,
    Role: requirement.RequiredPersonRole,
    FullName: requirement.RequiredPersonName,
    MobileNo: requirement.RequiredPersonPhone,
    EmailId: requirement.RequiredPersonEmail,
    RequirementArea:
      requirement.RequiredPropertyDetails.RequirementArea || "N/A",
    "Rent/Buy": requirement.RequiredPropertyDetails.RequiredPropertySellOrRent,
    LookingFor:
      Object.keys(requirement.AllPlotAndLand).find(
        (key) => requirement.AllPlotAndLand[key]
      ) || "N/A",
    PropertyType: requirement.RequiredPropertyDetails.RequiredPropertyType,
    areasqft: `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} - ${requirement.RequiredPropertyDetails.RequiredAreaSqft.max}`,
    MinBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.min}`,
    MaxBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.max}`,
    Description:
      requirement.RequiredPropertyDetails.RequiredDescription || "N/A",
  }));
};

module.exports = {
  transformResidentData,
  transformCommercialData,
  transformIndustrialData,
  transformAgricultureData,
};
