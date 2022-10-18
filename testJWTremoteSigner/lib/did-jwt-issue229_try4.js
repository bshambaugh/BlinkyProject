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
exports.P256Provider = void 0;
const did_jwt_1 = require("did-jwt");
const http = __importStar(require("http"));
const WebSocket = __importStar(require("websocket-stream"));
const fs = __importStar(require("fs"));
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
const rpc_utils_1 = require("rpc-utils");
const did_key_creator_1 = require("did-key-creator");
const nist_weierstrass = __importStar(require("nist-weierstrauss"));
const from_string_1 = require("uint8arrays/from-string");
const to_string_1 = require("uint8arrays/to-string");
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('stream', function (stream, request) {
    stream.setEncoding('utf8');
    const string = '2' + '1200' + 'f958a';
    setInterval(function () {
        (async function () {
            let response = await getSignature(stream, string);
            console.log(response);
            fs.appendFile('../data/duck.txt', response, (err) => {
                if (err)
                    throw err;
                console.log('The file has been saved!');
            });
            response = '';
        })();
    }, 2000);
});
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
server.listen(3000);
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
            if (result == true) {
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
    const publicKey = nist_weierstrass.nist_weierstrauss_common.publicKeyIntToUint8ArrayPointPair(nist_weierstrass.secp256r1.ECPointDecompress((0, from_string_1.fromString)(compressedPublicKey, 'base16')));
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
//# sourceMappingURL=did-jwt-issue229_try4.js.map