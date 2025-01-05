const propertyController = require("../controllers/PropertyController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/allprops/admin", propertyController.addProperty);
router.get("/", propertyController.getAllProperty);
router.get("/allprops/admin", propertyController.getAllAdminProperty);
router.get("/:id", propertyController.getPropertybyID);
router.put("/allprops/admin/:id", propertyController.updateProperty);
router.delete("allprops/admin/:id", propertyController.deleteProperty);
module.exports = router;
