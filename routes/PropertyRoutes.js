const propertyController = require("../controllers/PropertyController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/allprops/admin", propertyController.addProperty);
router.get("/", propertyController.getAllProperty);
router.get("/allprops/admin", propertyController.getAllAdminProperty);
router.get("/:id", propertyController.getPropertybyID);
router.put("/allprops/admin/:id", propertyController.updateProperty);
router.put("/allprops/admin", propertyController.updateAllProperties);
router.delete("/allprops/admin/:id", propertyController.deleteProperty);
router.get(
  "/allprops/admin/todaysIncrement",
  propertyController.getIdsAndDates
);
router.get("/allprops/admin/analysis", propertyController.getPropertyAsPerType);
module.exports = router;
