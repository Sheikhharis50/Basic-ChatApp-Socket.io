const cleint = require('socket.io')
const mongoose = require('mongoose')

let chatsSchema = require('../models/chats');


module.exports.listen = function (app) {
    io = cleint(app, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", socket => {

        socket.emit("getId", socket.id);

        socket.on("initials", () => {
            chatsSchema.find((err, res) => {
                if (err) {
                    console.log(err);
                }
                io.emit("fetchMessages", res);
            }).limit(100).sort({ _id: 1 })
        })

        socket.on("sendMessage", body => {
            chatsSchema.create(body, async (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
            io.emit("message", body);
        })
    })
}


