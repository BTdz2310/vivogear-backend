const reviewModel = require('../models/reviewModel');
const { checkId } = require('./authCtrl');

const getAllReview = async (req, res, next) => {
    
    try{
        const review = await reviewModel.find({
    
        });
        
        return res.status(200).json({
            msg: 'Success',
            data: review
        })
    }catch(err){
        return res.status(500).json({
            msg: err
        })
    }
}

const createReview = async (newReview) => {
    const {userId,inventoryId,productId,time,rating,comment,orderId} = newReview;

    const user = await checkId(userId);

    const review = await reviewModel.create({
        userId,
        inventoryId,
        productId,
        time,
        rating,
        comment,
        orderId,
        username: user.username,
        avatar: user.avatar
    });

    // const reviews = await reviewModel.find({});
    // console.log('review', reviews)
    return review;
}

module.exports = {
    getAllReview,
    createReview,
}