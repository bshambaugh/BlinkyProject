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
const EventEmitter = __importStar(require("events"));
const u8a = __importStar(require("uint8arrays"));
const EC = __importStar(require("elliptic"));
const fs = __importStar(require("fs"));
var ec = new EC.ec('p256');
const emitter = new EventEmitter.EventEmitter();
setInterval(function () {
    const string = '2' + '1200' + 'f958a';
    (async function () {
        let duck = await getSignature(string);
        console.log("received", duck);
        fs.appendFile('../data/duck.txt', duck, (err) => {
            if (err)
                throw err;
            console.log('The file has been saved!');
        });
    })();
}, 2000);
function waitForEvent(emitter, event) {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
    });
}
async function getSignature(name) {
    emitter.emit("greet", name);
    let result = await waitForEvent(emitter, "greet");
    let resultTwo = callToHSM(result);
    return resultTwo;
}
function callToHSM(value) {
    const privateKey = '0x040f1dbf0a2ca86875447a7c010b0fc6d39d76859c458fbe8f2bf775a40ad74a';
    const keypairTemp = ec.keyFromPrivate(privateKey);
    const buffferMsg = Buffer.from(value);
    let hexSig = keypairTemp.sign(buffferMsg);
    const xOctet = u8a.fromString(hexSig.r.toString(), 'base10');
    const yOctet = u8a.fromString(hexSig.s.toString(), 'base10');
    const hexR = u8a.toString(xOctet, 'base16');
    const hexS = u8a.toString(yOctet, 'base16');
    return hexR + hexS;
}
//# sourceMappingURL=eventEmitterSigner.js.map