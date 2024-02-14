const router = require("express").Router();
const {createInventory, getAllInventory, changeInventory} = require("../controllers/inventoryCtrl");

router.post("/inventory", createInventory);
router.get("/inventory", getAllInventory);
router.put('/inventory/:id', changeInventory)
// router.post("/logout", authCtrl.logout);
// router.post("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;