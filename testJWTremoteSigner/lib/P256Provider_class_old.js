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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.P256Provider = exports.ECPointDecompress = exports.testUint8Array = exports.publicKeyIntToUint8ArrayPointPair = void 0;
const did_jwt_1 = require("did-jwt");
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
const rpc_utils_1 = require("rpc-utils");
const did_key_creator_1 = require("did-key-creator");
const from_string_1 = require("uint8arrays/from-string");
const to_string_1 = require("uint8arrays/to-string");
const u8a = __importStar(require("uint8arrays"));
const http = __importStar(require("http"));
const WebSocket = __importStar(require("websocket-stream"));
const key_did_resolver_1 = require("key-did-resolver");
const dids_1 = require("dids");
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('stream', function (stream, request) {
    stream.setEncoding('utf8');
    const did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
    setInterval(function () {
        (async function () {
            const provider = await P256Provider.build(stream, did);
            console.log(provider);
            const didObject = new dids_1.DID({ provider, resolver: (0, key_did_resolver_1.getResolver)() });
        })();
    }, 250);
});
server.listen(3000);
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
async function getSignature(stream, string) {
    stream.write(string);
    let result = await waitForEvent(stream, 'data');
    return result;
}
async function waitForEvent(emitter, event) {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");
    });
}
function remoteP256Signer(stream) {
    return async (payload) => {
        return await getSignature(stream, payload);
    };
}
const sign = async (payload, stream, did, protectedHeader = {}) => {
    const kid = `${did}#${did.split(':')[2]}`;
    const signer = remoteP256Signer(stream);
    const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256' }));
    return (0, did_jwt_1.createJWS)(typeof payload === 'string' ? payload : toStableObject(payload), signer, header);
};
function toStableObject(obj) {
    return JSON.parse((0, fast_json_stable_stringify_1.default)(obj));
}
function toGeneralJWS(jws) {
    const [protectedHeader, payload, signature] = jws.split('.');
    return {
        payload,
        signatures: [{ protected: protectedHeader, signature }],
    };
}
const didMethods = {
    did_authenticate: async ({ did, stream }, params) => {
        const response = await sign({
            did,
            aud: params.aud,
            nonce: params.nonce,
            paths: params.paths,
            exp: Math.floor(Date.now() / 1000) + 600,
        }, stream, did);
        return toGeneralJWS(response);
    },
    did_createJWS: async ({ did, stream }, params) => {
        const requestDid = params.did.split('#')[0];
        if (requestDid !== did)
            throw new rpc_utils_1.RPCError(4100, `Unknown DID: ${did}`);
        const jws = await sign(params.payload, stream, did, params.protected);
        return { jws: toGeneralJWS(jws) };
    },
    did_decryptJWE: async () => {
        throw new rpc_utils_1.RPCError(4100, 'Decryption not supported');
    },
};
class P256Provider {
    constructor(stream, did) {
        const handler = (0, rpc_utils_1.createHandler)(didMethods);
        this._handle = async (msg) => await handler({ did, stream }, msg);
    }
    static async build(stream, did) {
        const DIDKeyExists = (async function () { return await matchDIDKeyWithRemote(did, stream); })();
        const publicKey = (async function () { return await getPublicKey(stream); })();
        DIDKeyExists.then(function (result) {
            if (result === true) {
                did = did;
            }
            else {
                const multicodecName = 'p256-pub';
                try {
                    publicKey.then(function (resultTwo) { did = (0, did_key_creator_1.encodeDIDfromHexString)(multicodecName, (0, did_key_creator_1.compressedKeyInHexfromRaw)(resultTwo)); });
                }
                catch (ex) {
                    console.log("async failed with", ex);
                }
            }
        });
        return new P256Provider(stream, did);
    }
    get isDidProvider() {
        return true;
    }
    async send(msg) {
        return await this._handle(msg);
    }
}
exports.P256Provider = P256Provider;
async function matchDIDKeyWithRemote(didkeyURL, stream) {
    const compressedPublicKey = (0, did_key_creator_1.didKeyURLtoPubKeyHex)(didkeyURL);
    const publicKey = publicKeyIntToUint8ArrayPointPair(ECPointDecompress((0, from_string_1.fromString)(compressedPublicKey, 'base16')));
    const publicRawKey = octetToRaw(publicKey);
    return await matchPublicKeyWithRemote(publicRawKey, stream);
}
async function matchPublicKeyWithRemote(publicKey, stream) {
    let rpcPayload = '0' + '1200' + publicKey;
    stream.write(rpcPayload);
    let result = await waitForEvent(stream, 'data');
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
async function getPublicKey(stream) {
    let rpcPayload = '2' + '1200';
    stream.write(rpcPayload);
    let result = await waitForEvent(stream, 'data');
    return result;
}
//# sourceMappingURL=P256Provider_class_old.js.map