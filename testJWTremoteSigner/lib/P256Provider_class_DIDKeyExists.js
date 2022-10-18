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
exports.publicKeyIntToUint8ArrayPointPair = exports.ECPointDecompress = exports.testUint8Array = void 0;
const did_key_creator_1 = require("did-key-creator");
const from_string_1 = require("uint8arrays/from-string");
const to_string_1 = require("uint8arrays/to-string");
const u8a = __importStar(require("uint8arrays"));
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
            const DIDKeyExists = await matchDIDKeyWithRemote(did, stream);
            console.log('DIDKeyExists is:');
            console.log(DIDKeyExists);
        })();
    }, 250);
});
server.listen(3000);
function toZn(a, n) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    const aZn = a % n;
    return (aZn < 0n) ? aZn + n : aZn;
}
function eGcd(a, b) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof b === 'number')
        b = BigInt(b);
    if (a <= 0n || b <= 0n)
        throw new RangeError('a and b MUST be > 0');
    let x = 0n;
    let y = 1n;
    let u = 1n;
    let v = 0n;
    while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - (u * q);
        const n = y - (v * q);
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        g: b,
        x: x,
        y: y
    };
}
function modInv(a, n) {
    const egcd = eGcd(toZn(a, n), n);
    if (egcd.g !== 1n) {
        throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`);
    }
    else {
        return toZn(egcd.x, n);
    }
}
function abs(a) {
    return (a >= 0) ? a : -a;
}
function modPow(b, e, n) {
    if (typeof b === 'number')
        b = BigInt(b);
    if (typeof e === 'number')
        e = BigInt(e);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    else if (n === 1n) {
        return 0n;
    }
    b = toZn(b, n);
    if (e < 0n) {
        return modInv(modPow(b, abs(e), n), n);
    }
    let r = 1n;
    while (e > 0) {
        if ((e % 2n) === 1n) {
            r = r * b % n;
        }
        e = e / 2n;
        b = b ** 2n % n;
    }
    return r;
}
function testUint8Array(param) {
    if (param == null) {
        return false;
    }
    if (param.constructor === Uint8Array) {
        return true;
    }
    else {
        return false;
    }
}
exports.testUint8Array = testUint8Array;
function ECPointDecompress(comp) {
    if (!testUint8Array(comp)) {
        throw new TypeError('input must be a Uint8Array');
    }
    const two = BigInt(2);
    const prime = (two ** 256n) - (two ** 224n) + (two ** 192n) + (two ** 96n) - 1n;
    const b = 41058363725152142129326129780047268409114441015993725554835256314039467401291n;
    const pIdent = (prime + 1n) / 4n;
    const signY = BigInt(comp[0] - 2);
    const x = comp.subarray(1);
    const xBig = BigInt(u8a.toString(x, 'base10'));
    const a = xBig ** 3n - xBig * 3n + b;
    let yBig = modPow(a, pIdent, prime);
    if (yBig % 2n !== signY) {
        yBig = prime - yBig;
    }
    return {
        x: xBig,
        y: yBig
    };
}
exports.ECPointDecompress = ECPointDecompress;
function publicKeyIntToUint8ArrayPointPair(ecpoint) {
    if (ecpoint == null) {
        throw new TypeError('input cannot be null or undefined.');
    }
    if (typeof ecpoint !== "object") {
        throw new TypeError("Input must be an object with properties x and y");
    }
    if (!Object.prototype.hasOwnProperty.call(ecpoint, "x") || !Object.prototype.hasOwnProperty.call(ecpoint, "y")) {
        throw new Error("Input must have properties x and y");
    }
    if (typeof ecpoint.x !== "bigint" && typeof ecpoint.y !== "bigint") {
        throw new Error("Input coordinates must be BigInt");
    }
    const xHex = (ecpoint.x).toString();
    const yHex = (ecpoint.y).toString();
    const xOctet = u8a.fromString(xHex, 'base10');
    const yOctet = u8a.fromString(yHex, 'base10');
    return { xOctet, yOctet };
}
exports.publicKeyIntToUint8ArrayPointPair = publicKeyIntToUint8ArrayPointPair;
async function waitForEvent(emitter, event) {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");
    });
}
async function matchDIDKeyWithRemote(didkeyURL, stream) {
    const compressedPublicKey = (0, did_key_creator_1.didKeyURLtoPubKeyHex)(didkeyURL);
    console.log(compressedPublicKey);
    const publicKey = publicKeyIntToUint8ArrayPointPair(ECPointDecompress((0, from_string_1.fromString)(compressedPublicKey, 'base16')));
    console.log(publicKey);
    const publicRawKey = octetToRaw(publicKey);
    console.log(publicRawKey);
    return await matchPublicKeyWithRemote(publicRawKey, stream);
}
async function matchPublicKeyWithRemote(publicKey, stream) {
    let rpcPayload = '0' + '1200' + publicKey;
    stream.write(rpcPayload);
    console.log('rpcpaylod' + rpcPayload);
    let result = await waitForEvent(stream, 'data');
    console.log('result is:' + result);
    if (result === '1') {
        return true;
    }
    else {
        return false;
    }
}
function octetToRaw(publicKey) {
    return (0, to_string_1.toString)(publicKey.xOctet, 'hex') + (0, to_string_1.toString)(publicKey.yOctet, 'hex');
}
//# sourceMappingURL=P256Provider_class_DIDKeyExists.js.map