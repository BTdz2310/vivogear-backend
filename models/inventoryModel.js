const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    idSP: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Products'
    },
    size:{
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    }
},
    {
        collection: 'Inventory'
    })

module.exports = mongoose.model('inventory', inventorySchema)