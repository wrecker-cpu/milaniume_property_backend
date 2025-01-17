const requirementController = require("../controllers/RequireController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", requirementController.addRequirement);
router.get("/", requirementController.getAllRequirement);
router.get("/:id", requirementController.getRequirementbyID);
router.get("/allprops/admin", requirementController.getAllAdminRequirement);
router.put("/allprops/admin/:id", requirementController.updateRequirement);
router.delete("/allprops/admin/:id", requirementController.deleteRequirement);
router.get(
  "/requirement/get-excel",
  requirementController.getExcelForRequirement
);
router.put("/:id", requirementController.updateRequirement);
router.delete("/:id", requirementController.deleteRequirement);
router.put("/all/updateAll", requirementController.updateAllRequirement);
module.exports = router;
