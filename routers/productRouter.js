const router = require("express").Router();
const {createProduct, getAllProducts, changeProduct, deleteProduct} = require("../controllers/productCtrl");
const { redisCacheMiddleware } = require("../middlewares/redis");

router.post("/product", createProduct);
router.get("/product", redisCacheMiddleware(), getAllProducts);
router.put("/product/:id", changeProduct);
router.delete('/product/:id', deleteProduct)
// router.post("/logout", authCtrl.logout);
// router.post("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;