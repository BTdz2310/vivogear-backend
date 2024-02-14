const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    user: {
        type: String,
        ref: "Users" 
    },
    url: String,
    text: String,
    content: String,
    image: String,
    createTime: {
      type: String
    },
    isRead: { type: Boolean, default: false },
  },
  {
    collection: 'Notifies'
  }
);

module.exports = mongoose.model("notify", notifySchema);