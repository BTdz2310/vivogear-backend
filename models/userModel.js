const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        default: '',
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        default: ''
        // required: true
    },
    address: {
        type: String,
        default: ''
        // required: true
    },
    point: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-122.jpg'
    },
    voucher: {
        type: [{
            code: {
                type: String,
                ref: 'Voucher'
            },
            used: Boolean
        }],
        default: []
    },
    social: {
        type: String
    },
    socialId: {
        type: String
    }
},
    {
        collection: 'Users'
    })

module.exports = mongoose.model('users', userSchema)