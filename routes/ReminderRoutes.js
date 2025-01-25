const reminderController = require("../controllers/ReminderController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", reminderController.addReminder);
router.get("/allprops/admin", reminderController.getAllAdminReminder);
router.put("/allprops/admin/:id", reminderController.updateReminder);
router.delete("/allprops/admin/:id", reminderController.updateReminder);
router.get("/", reminderController.getAllReminder);
router.get("/:id", reminderController.getReminderbyID);
router.put("/:id", reminderController.updateReminder);
router.delete("/:id", reminderController.deleteReminder);
module.exports = router;
