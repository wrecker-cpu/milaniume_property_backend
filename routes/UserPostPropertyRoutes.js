const PostPropertyController = require("../controllers/UserPostPropertyController");
const auth = require("../auth/AuthValidation");
const router = require("express").Router();

router.post("/", PostPropertyController.addPostProperty);
router.get("/", PostPropertyController.getAllPostProperty);
router.get("/:id", PostPropertyController.getPostPropertybyID);
router.put("/:id", PostPropertyController.updatePostProperty);
router.delete("/:id", PostPropertyController.deletePostProperty);
router.get("/userpost/get-excel", PostPropertyController.getExcelForUserPosts);
module.exports = router;
