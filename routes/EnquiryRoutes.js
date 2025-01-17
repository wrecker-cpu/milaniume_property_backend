const enquiryController = require("../controllers/EnquiryController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", enquiryController.addEnquiry);
router.get("/excel/get-excel", enquiryController.getExcelForEnquiry);
router.put("/all/updateAll", enquiryController.updateAllEnquires);
router.get("/allprops/admin", enquiryController.getAllAdminEnquiry);
router.put("/allprops/admin/:id", enquiryController.updateEnquiry);
router.delete("/allprops/admin/:id", enquiryController.updateEnquiry);
router.get("/", enquiryController.getAllEnquiry);
router.get("/:id", enquiryController.getEnquirybyID);
router.put("/:id", enquiryController.updateEnquiry);
router.delete("/:id", enquiryController.deleteEnquiry);
module.exports = router;
