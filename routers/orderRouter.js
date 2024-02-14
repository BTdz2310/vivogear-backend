const router = require("express").Router();
const {createOrder, getUserOrder, getAllOrder} = require("../controllers/orderCtrl");
const auth = require("../middlewares/auth");

// router.post("/product", createProduct);
router.post("/order", auth ,createOrder);
router.get("/order", auth ,getUserOrder);
router.get("/orders", auth ,getAllOrder);

module.exports = router;