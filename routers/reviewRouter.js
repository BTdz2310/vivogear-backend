const router = require("express").Router();
const {getAllReview} = require("../controllers/reviewCtrl");

router.get("/review", getAllReview);
// router.post("/review", createReview);

module.exports = router;