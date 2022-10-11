"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.P256Provider = void 0;
var did_jwt_1 = require("did-jwt");
var fast_json_stable_stringify_1 = require("fast-json-stable-stringify");
var rpc_utils_1 = require("rpc-utils");
var did_key_creator_1 = require("did-key-creator");
var from_string_1 = require("uint8arrays/from-string");
var to_string_1 = require("uint8arrays/to-string");
var http = require("http");
var WebSocket = require("websocket-stream");
var nist_weierstrauss = require("nist-weierstrauss");
var key_did_resolver_1 = require("@ceramicnetwork/key-did-resolver");
var dids_1 = require("dids");
var server = http.createServer();
var websocketServer = new WebSocket.Server({ server: server });
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('stream', function (stream, request) {
    //stream.read();
    stream.setEncoding('utf8');
    var did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
    // const did = 'did:key:zDnaezUFn4zmNoNeZvBEdVyCv6MVL69X8NRD8YavTCJWGuXM7';
    /*
    const provider = P256Provider.build(stream,did);
    console.log(provider);
    */
    setInterval(function () {
        (function () {
            return __awaiter(this, void 0, void 0, function () {
                var provider, didObject, auth;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, P256Provider.build(stream, did)];
                        case 1:
                            provider = _a.sent();
                            console.log(provider);
                            didObject = new dids_1.DID({ provider: provider, resolver: key_did_resolver_1["default"].getResolver() });
                            return [4 /*yield*/, didObject.authenticate()];
                        case 2:
                            auth = _a.sent();
                            console.log('auth is');
                            console.log(auth);
                            return [2 /*return*/];
                    }
                });
            });
        })();
    }, 250);
});
server.listen(3000);
function getSignature(stream, string) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stream.write(string);
                    return [4 /*yield*/, waitForEvent(stream, 'data')];
                case 1:
                    result = _a.sent();
                    //console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
// I think that I have to close some listeners here....because I get to the maxListner limit
function waitForEvent(emitter, event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    emitter.once(event, resolve);
                    emitter.once("error", reject);
                    emitter.removeAllListeners("error"); /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
                })];
        });
    });
}
function remoteP256Signer(stream) {
    var _this = this;
    return function (payload) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSignature(stream, payload)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
}
var sign = function (payload, stream, did, protectedHeader) {
    if (protectedHeader === void 0) { protectedHeader = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var kid, signer, header;
        return __generator(this, function (_a) {
            kid = "".concat(did, "#").concat(did.split(':')[2]);
            signer = remoteP256Signer(stream) // see remoteP256Signer.ts // const signer = EdDSASigner(secretKey)
            ;
            header = toStableObject(Object.assign(protectedHeader, { kid: kid, alg: 'ES256' })) /// see https://datatracker.ietf.org/doc/html/rfc7518
            ;
            return [2 /*return*/, (0, did_jwt_1.createJWS)(typeof payload === 'string' ? payload : toStableObject(payload), signer, header)];
        });
    });
};
function toStableObject(obj) {
    return JSON.parse((0, fast_json_stable_stringify_1["default"])(obj));
}
function toGeneralJWS(jws) {
    var _a = jws.split('.'), protectedHeader = _a[0], payload = _a[1], signature = _a[2];
    return {
        payload: payload,
        signatures: [{ protected: protectedHeader, signature: signature }]
    };
}
var didMethods = {
    did_authenticate: function (_a, params) {
        var did = _a.did, stream = _a.stream;
        return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, sign({
                            did: did,
                            aud: params.aud,
                            nonce: params.nonce,
                            paths: params.paths,
                            exp: Math.floor(Date.now() / 1000) + 600
                        }, stream, did)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, toGeneralJWS(response)];
                }
            });
        });
    },
    did_createJWS: function (_a, params) {
        var did = _a.did, stream = _a.stream;
        return __awaiter(void 0, void 0, void 0, function () {
            var requestDid, jws;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        requestDid = params.did.split('#')[0];
                        if (requestDid !== did)
                            throw new rpc_utils_1.RPCError(4100, "Unknown DID: ".concat(did));
                        return [4 /*yield*/, sign(params.payload, stream, did, params.protected)
                            // const jws = await sign(params.payload, did, secretKey, params.protected)
                        ];
                    case 1:
                        jws = _b.sent();
                        // const jws = await sign(params.payload, did, secretKey, params.protected)
                        return [2 /*return*/, { jws: toGeneralJWS(jws) }];
                }
            });
        });
    },
    did_decryptJWE: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new rpc_utils_1.RPCError(4100, 'Decryption not supported');
        });
    }); }
};
var P256Provider = /** @class */ (function () {
    function P256Provider(stream, did) {
        var _this = this;
        var handler = (0, rpc_utils_1.createHandler)(didMethods);
        // this code has to check whether the did is valid for the remote ... but does the logic have to be here??
        this._handle = function (msg) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handler({ did: did, stream: stream }, msg)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
    }
    P256Provider.build = function (stream, did) {
        return __awaiter(this, void 0, void 0, function () {
            var newDID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, matchDIDKeyWithRemote(did, stream)];
                    case 1:
                        newDID = _a.sent();
                        did = newDID;
                        return [2 /*return*/, new P256Provider(stream, did)];
                }
            });
        });
    };
    Object.defineProperty(P256Provider.prototype, "isDidProvider", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    P256Provider.prototype.send = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._handle(msg)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return P256Provider;
}());
exports.P256Provider = P256Provider;
function matchDIDKeyWithRemote(didkeyURL, stream) {
    return __awaiter(this, void 0, void 0, function () {
        var compressedPublicKey, publicKey, publicRawKey, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    compressedPublicKey = (0, did_key_creator_1.didKeyURLtoPubKeyHex)(didkeyURL);
                    publicKey = nist_weierstrauss.nist_weierstrauss_common.publicKeyIntToUint8ArrayPointPair(nist_weierstrauss.secp256r1.ECPointDecompress((0, from_string_1.fromString)(compressedPublicKey, 'hex')));
                    publicRawKey = octetToRaw(publicKey);
                    return [4 /*yield*/, matchPublicKeyWithRemote(publicRawKey, stream)];
                case 1:
                    result = _a.sent();
                    if (result.length > 1) {
                        return [2 /*return*/, rpcToDID(result)];
                    }
                    else {
                        return [2 /*return*/, didkeyURL];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function matchPublicKeyWithRemote(publicKey, stream) {
    return __awaiter(this, void 0, void 0, function () {
        var rpcPayload, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpcPayload = '0' + '1200' + publicKey;
                    stream.write(rpcPayload);
                    return [4 /*yield*/, waitForEvent(stream, 'data')];
                case 1:
                    result = _a.sent();
                    // console.log('result is:'+result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function octetToRaw(publicKey) {
    return (0, to_string_1.toString)(publicKey.xOctet, 'hex') + (0, to_string_1.toString)(publicKey.yOctet, 'hex');
}
function rpcToDID(response) {
    var result = response.split(',');
    //compressedKeyInHexfromRaw(result[1])
    // return result[1];
    var multicodecName = 'p256-pub';
    return (0, did_key_creator_1.encodeDIDfromHexString)(multicodecName, (0, did_key_creator_1.compressedKeyInHexfromRaw)(result[1]));
}
function getPublicKey(stream) {
    return __awaiter(this, void 0, void 0, function () {
        var rpcPayload, preResult, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpcPayload = '1' + '1200';
                    stream.write(rpcPayload);
                    return [4 /*yield*/, waitForEvent(stream, 'data')];
                case 1:
                    preResult = _a.sent();
                    console.log(preResult);
                    result = preResult.split(',');
                    return [2 /*return*/, result[1]];
            }
        });
    });
}
