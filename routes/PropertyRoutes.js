const propertyController = require("../controllers/PropertyController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", propertyController.addProperty);
router.get("/", propertyController.getAllProperty);
router.get("/allprops/admin", propertyController.getAllAdminProperty);
router.get("/:id", propertyController.getPropertybyID);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);
module.exports = router;
