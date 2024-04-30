import { Socket } from "socket.io";

export const sessionMap : Map<string, Socket> = new Map();