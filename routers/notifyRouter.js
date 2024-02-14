const router = require("express").Router();
const {getAllNotify} = require("../controllers/notifyCtrl");
const auth = require("../middlewares/auth");

// router.post("/product", createProduct);
router.get("/notify", auth ,getAllNotify);

module.exports = router;