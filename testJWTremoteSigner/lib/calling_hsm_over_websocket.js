"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('connection', function connection(ws) {
    console.log("client connected");
    const duplexWebSocketStream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    duplexWebSocketStream.write('2' + '1200' + 'e2bc6e7c4223f5e2f2fd69736216e71348d122ae644ca8a0cca1d2598938b048');
    duplexWebSocketStream.write("01200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24fa");
    duplexWebSocketStream.on('message', function message(data) {
        console.log('received: %s', data);
    });
});
server.listen(3000);
//# sourceMappingURL=calling_hsm_over_websocket.js.map