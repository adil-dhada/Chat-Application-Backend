import { WebSocket, WebSocketServer } from "ws";
import { joinRoom, roomSocket, sendMessage, socketpayload, socketRequest } from "./types/socket";

const wss = new WebSocketServer({ port: 8080 });

let allsockets : roomSocket[] = [];

wss.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("message", (data) => {
        console.log("Message sent from browser: ", data.toString());
        try{
            const message = JSON.parse(data.toString()) as socketRequest<socketpayload>;
            
            if(message.type == "join"){
                const reqRoomId = (<joinRoom>message.payload).roomId;
                allsockets.push({ roomId: reqRoomId, socket: socket});
                console.log("user joined room: ", reqRoomId);
            }
            if(message.type == "message"){
                const reqMessage = (<sendMessage>message.payload).message;
                const userRoomId = allsockets.find(t => t.socket === socket);
                if(userRoomId !== undefined){
                    allsockets.filter(t => t.roomId === userRoomId.roomId).forEach(t => t.socket.send(reqMessage));
                }
            }
        }
        catch(e){
            console.log(e);
        }
    });

    socket.on("close", () => {
        allsockets = allsockets.filter(t => t.socket != socket);
    })
});