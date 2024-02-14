const router = require("express").Router();
const {register, login, checkAuth, test, updateUser, addVoucherUser, changePassword, useVoucher, checkAdmin} = require("../controllers/authCtrl");
const auth = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get('/credential', auth, checkAuth);
router.get('/checkAdmin', auth, checkAdmin);
router.get('/test', test)
router.post('/changePassword', auth, changePassword)
router.post('/profile',auth ,updateUser);
router.post('/addVoucherUser', auth, addVoucherUser)
router.post('/useVoucher', auth, useVoucher)

module.exports = router;
