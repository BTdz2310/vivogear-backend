const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    created_at: {
        type: Number,
        required: true
    },
    content: {
        type: String
    },
    link: {
        type: {
            link_type: Number,
            link_id: String
        }
    },
    side: {
        type: Number,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
    {
        collection: 'Chats'
    })

module.exports = mongoose.model('chats', chatSchema)