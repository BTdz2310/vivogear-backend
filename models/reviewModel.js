const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'Users'
    },
    orderId: {
        type: String, 
        ref: 'Orders'
    },
    inventoryId: {
        type: String, 
        ref: 'Inventory'
    },
    productId: {
        type: String, 
        ref: 'Products'
    },
    time: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    like: {
        type: Array,
        default: []
    },
    username: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    }
},
    {
        collection: 'Reviews'
    })

module.exports = mongoose.model('review', reviewSchema)