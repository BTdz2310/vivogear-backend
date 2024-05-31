const dotenv = require('dotenv').config();
const router = require("express").Router();
const {createOrder, getUserOrder, getAllOrder} = require("../controllers/orderCtrl");
const {getAllReview} = require("../controllers/reviewCtrl");
const auth = require("../middlewares/auth");

const stripe = require('stripe')(process.env.SECRET_STRIPE);

// router.post("/product", createProduct);
router.post("/order", auth ,createOrder);
router.get("/order", auth ,getUserOrder);
router.get("/orders", auth ,getAllOrder);
router.get("/review", getAllReview);

router.post('/create-payment-intent', async (req, res)=>{
    try{
        console.log(req)
        const {amount} = req.body;
        console.log(amount)
        const paymentIntent = await stripe.paymentIntents.create({
            currency: 'usd',
            amount: amount,
            automatic_payment_methods: {
                enabled: true
            }
        })
        return res.json({
            clientSecret: paymentIntent.client_secret
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            msg: e
        })
    }
})


module.exports = router;