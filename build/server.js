"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = new http.Server(app);
const io = socketIO(server);
server.listen(4000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server listen on 4000");
    }
});
io.on("connection", (socket) => {
    socket.emit("news", { hello: "world" });
    console.log("hello");
});
io.on("test", (message) => {
    console.log(message);
});
//# sourceMappingURL=server.js.map