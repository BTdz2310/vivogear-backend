const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
        type: String,
        ref: "Users" 
    },
    products: [{
        inventoryId: {
            type: String, 
            ref: 'Inventory'
        },
        productId: {
            type: String, 
            ref: 'Products'
        },
        quantity: {
            type: Number
        },
        img: {
            type: String
        },
        name: {
            type: String
        }
    }],
    status: {
        type: Number,
    },
    placed: {
        type: Number
    },
    confirmed: {
        type: Number
    },
    pickup: {
        type: Number
    },
    received: {
        type: Number
    },
    success: {
        type: Number
    },
    returned: {
        type: Number
    },
    canceled: {
        type: Number
    },
    message: {
        type: String
    },
    total: {
        type: Number
    },
    voucher: {
        type: [String],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
  },
  {
    collection: 'Orders'
  }
);

module.exports = mongoose.model("order", orderSchema);