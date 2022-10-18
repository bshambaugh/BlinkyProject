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
const WebSocket = __importStar(require("websocket-stream"));
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('stream', function (stream, request) {
    const payload = 'f958a';
    var interval = setInterval(function () {
        writer(stream, payload).then(data => {
            console.log('the data is', data);
        });
    }, 2000);
});
async function writer(stream, payload) {
    stream.setEncoding('utf8');
    let data = '';
    let string = '2' + '1200' + payload;
    stream.write(string, () => console.log('I am a penguin'));
    stream.on('data', (chunk) => {
        console.log('the chunk is', chunk);
        console.log(`Received ${chunk.length} bytes of data.`);
        data = chunk.toString();
    });
    return data;
}
server.listen(3000);
//# sourceMappingURL=testing-websocket-stream-copy.js.map