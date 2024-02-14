const router = require("express").Router();
const {getAllVoucher, createVoucher, updateVoucher, deleteVoucher} = require("../controllers/voucherCtrl");
const auth = require("../middlewares/auth");

// router.post("/product", createProduct);
router.get("/voucher" ,getAllVoucher);
router.post('/voucher', createVoucher);
router.put('/voucher/:idVoucher', updateVoucher);
router.delete('/voucher/:idVoucher', deleteVoucher);

module.exports = router;