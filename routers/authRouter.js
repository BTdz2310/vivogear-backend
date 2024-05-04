const router = require("express").Router();
const {register, login, checkAuth, test, updateUser, addVoucherUser, changePassword, checkAdmin, getUserDataGoogle, getAccessTokenGithub, getUserDataGithub} = require("../controllers/authCtrl");
const auth = require("../middlewares/auth");
// const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";

router.post("/register", register);
router.post("/login", login);
router.get('/credential', auth, checkAuth);
router.get('/checkAdmin', auth, checkAdmin);
router.get('/test', test)
router.post('/changePassword', auth, changePassword)
router.post('/profile',auth ,updateUser);
router.post('/addVoucherUser', auth, addVoucherUser)

router.get('/google/login', (req, res) => {
    const accessToken = req.query.accessToken;
    getUserDataGoogle(accessToken).then((resp) => res.status(resp.status).json(
        {
            msg: resp.msg,
            access_token: resp.access_token,
            user: resp.user
        }
    ));
});

router.get('/github/accessToken', (req, res) => {
    const code = req.query.code;
    getAccessTokenGithub(code).then((resp) => res.json(resp));
});
  
router.get('/github/login', (req, res) => {
    const accessToken = req.query.accessToken;
    getUserDataGithub(accessToken).then((resp) => res.status(resp.status).json(
        {
            msg: resp.msg,
            access_token: resp.access_token,
            user: resp.user
        }));
});



module.exports = router;
