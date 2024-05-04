const router = require("express").Router();
const {createOrder, getUserOrder, getAllOrder} = require("../controllers/orderCtrl");
const {getAllReview} = require("../controllers/reviewCtrl");
const auth = require("../middlewares/auth");

// router.post("/product", createProduct);
router.post("/order", auth ,createOrder);
router.get("/order", auth ,getUserOrder);
router.get("/orders", auth ,getAllOrder);
router.get("/review", getAllReview);

module.exports = router;