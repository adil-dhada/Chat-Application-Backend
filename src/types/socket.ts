import { WebSocket } from "ws";

export interface roomSocket {
    roomId: string,
    socket: WebSocket
}

export interface socketRequest<T> {
    type: "join" | "message",
    payload: T
}

export type socketpayload = sendMessage | joinRoom;

export type sendMessage = {
    message: string;
}

export type joinRoom = {
    roomId: string;
}