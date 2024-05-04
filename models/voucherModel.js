const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    minO: {
        type: Number
    },
    maxD: {
        type: Number
    },
    expired: {
        type: Number,
        required: true
    },
    canSave: {
        type: Boolean,
        required: true
    },
    products: {
        type: Array
    },
    inform: {
        type: Boolean
    }
},{
    collection: 'Voucher'
})

module.exports = mongoose.model('voucher', voucherSchema)