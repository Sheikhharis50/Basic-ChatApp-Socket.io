const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let chatsSchema = new Schema(
    {
        name: {
            type: String,
        },
        body: {
            type: String,
        },
        sentDate: {
            type: Date,
            default: new Date()
        }
    },
    {
        collection: 'chats'
    },
)

module.exports = mongoose.model('Chats', chatsSchema)