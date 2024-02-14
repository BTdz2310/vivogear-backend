const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    details: {
        type: Object,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    imgsDetail: {
        type: Array,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    color: {
        type: Array,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    }
},
    {
        collection: 'Products'
    })

module.exports = mongoose.model('products', productSchema)