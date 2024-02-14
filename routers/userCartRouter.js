const router = require("express").Router();
const {createUserCart, getAllUserCart, updateUserCart, deleteUserCart, clearUserCart} = require("../controllers/userCartCtrl");
const auth = require("../middlewares/auth");

router.post("/userCart", auth ,createUserCart);
router.get("/userCart", auth, getAllUserCart);
router.put('/userCart', auth, updateUserCart);
router.delete('/userCart', auth, deleteUserCart);
router.get('/clearCart', auth, clearUserCart)

module.exports = router;