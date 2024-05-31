const router = require("express").Router();
const { getAllMsg, newChat, getMsgAdmin } = require("../controllers/chatCtrl");
const auth = require("../middlewares/auth");

router.get("/chats", auth, getAllMsg);
router.post("/chat", newChat);
router.get('/chatAdmin', auth, getMsgAdmin);

module.exports = router;