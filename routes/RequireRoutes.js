const requirementController = require("../controllers/RequireController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", requirementController.addRequirement);
router.get("/", requirementController.getAllRequirement);
router.get("/:id", requirementController.getRequirementbyID);
router.put("/:id", requirementController.updateRequirement);
router.delete("/:id", requirementController.deleteRequirement);
module.exports = router;
