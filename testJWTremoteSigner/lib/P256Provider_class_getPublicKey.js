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
    stream.setEncoding('utf8');
    const did = 'did:key:zDnaezUFn4zmNoNeZvBEdVyCv6MVL69X8NRD8YavTCJWGuXM7';
    setInterval(function () {
        (async function () {
            const publicKey = await getPublicKey(stream);
            console.log('public Key is:');
            console.log(publicKey);
        })();
    }, 250);
});
server.listen(3000);
async function waitForEvent(emitter, event) {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");
    });
}
async function getPublicKey(stream) {
    let rpcPayload = '1' + '1200';
    stream.write(rpcPayload);
    let preResult = await waitForEvent(stream, 'data');
    console.log(preResult);
    let result = preResult.split(',');
    return result[1];
}
//# sourceMappingURL=P256Provider_class_getPublicKey.js.map