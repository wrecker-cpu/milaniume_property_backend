const transformResidentData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: new Date(requirement?.RequiredPersonDate).toLocaleString(
      "en-US",
      {
        dateStyle: "short",
        timeStyle: "medium",
      }
    ),
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
      requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} sqft`
        : "N/A"
    } to ${
      requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.max} sqft`
        : "N/A"
    }`,
    areasqyd:`${
      requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.min
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.min} sqft`
        : "N/A"
    } to ${
      requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.max
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.max} sqft`
        : "N/A"
    }`,
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


const transformCommercialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: new Date(requirement?.RequiredPersonDate).toLocaleString(
      "en-US",
      {
        dateStyle: "short",
        timeStyle: "medium",
      }
    ),
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
        areasqft: `${
          requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min
            ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} sqft`
            : "N/A"
        } to ${
          requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max
            ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.max} sqft`
            : "N/A"
        }`,
        areasqyd:`${
          requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.min
            ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.min} sqft`
            : "N/A"
        } to ${
          requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.max
            ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.max} sqft`
            : "N/A"
        }`,
    MinBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.min}`,
    MaxBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.max}`,
    Description:
      requirement.RequiredPropertyDetails.RequiredDescription || "N/A",
  }));
};


const transformIndustrialData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: new Date(requirement?.RequiredPersonDate).toLocaleString(
      "en-US",
      {
        dateStyle: "short",
        timeStyle: "medium",
      }
    ),
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
      areasqft: `${
        requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min
          ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} sqft`
          : "N/A"
      } to ${
        requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max
          ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.max} sqft`
          : "N/A"
      }`,
      areasqyd:`${
        requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.min
          ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.min} sqft`
          : "N/A"
      } to ${
        requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.max
          ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.max} sqft`
          : "N/A"
      }`,
    MinBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.min}`,
    MaxBudget: `${requirement.RequiredPropertyDetails.RequiredBudget.max}`,
    Description:
      requirement.RequiredPropertyDetails.RequiredDescription || "N/A",
  }));
};


const transformAgricultureData = (filteredData) => {
  return filteredData.map((requirement) => ({
    RequirementIdNo: requirement._id,
    DateAndTime: new Date(requirement?.RequiredPersonDate).toLocaleString(
      "en-US",
      {
        dateStyle: "short",
        timeStyle: "medium",
      }
    ),
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
    areasqft: `${
      requirement.RequiredPropertyDetails?.RequiredAreaSqft?.min
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.min} sqft`
        : "N/A"
    } to ${
      requirement.RequiredPropertyDetails?.RequiredAreaSqft?.max
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqft.max} sqft`
        : "N/A"
    }`,
    areasqyd:`${
      requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.min
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.min} sqft`
        : "N/A"
    } to ${
      requirement.RequiredPropertyDetails?.RequiredAreaSqyd?.max
        ? `${requirement.RequiredPropertyDetails.RequiredAreaSqyd.max} sqft`
        : "N/A"
    }`,
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
