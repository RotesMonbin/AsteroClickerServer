import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

server.listen(4000, (err: Error) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server listen on 4000");
    }
});

io.on("connection",(socket:SocketIO.Socket)=>{
    socket.emit("news",{hello:"world"});
    console.log("hello");
})

io.on("test",(message:string)=>{
    console.log(message);
});