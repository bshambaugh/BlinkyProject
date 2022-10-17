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
var http = require("http");
//import * as WebSocket from 'ws'
var WebSocket = require("websocket-stream");
var fs = require("fs");
var fast_json_stable_stringify_1 = require("fast-json-stable-stringify");
var rpc_utils_1 = require("rpc-utils");
var did_key_creator_1 = require("did-key-creator");
//import * as keydidresolver from '/home/ubuntu/Downloads/nov22nd/js-ceramic/packages/key-did-resolver/lib/index.js'  // I cannot import this ...
var nist_weierstrass = require("nist-weierstrauss");
var from_string_1 = require("uint8arrays/from-string");
var to_string_1 = require("uint8arrays/to-string");
//import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';
/**************************websocket_example.js*************************************************/
var server = http.createServer();
var websocketServer = new WebSocket.Server({ server: server });
//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
websocketServer.on('stream', function (stream, request) {
    //stream.read();
    stream.setEncoding('utf8');
    var string = '2' + '1200' + 'f958a';
    /*
    var interval = setInterval(function(){
     stream.write(string, () => console.log('I am a penguin' ));
    // writer(stream,string);
   }, 2000);
   */
    setInterval(function () {
        (function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getSignature(stream, string)];
                        case 1:
                            response = _a.sent();
                            // console.log("received",response);
                            console.log(response);
                            //const signer = remoteP256Signer(stream);
                            //console.log(signer);
                            /*
                            const payload = '2'+'1200'+'f958a';
                        
                            const kid = `${did}#${did.split(':')[2]}`
                            const signer = remoteP256Signer(stream) // see remoteP256Signer.ts // const signer = EdDSASigner(secretKey)
                            const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256' }))  /// see https://datatracker.ietf.org/doc/html/rfc7518
                            return createJWS(typeof payload === 'string' ? payload : toStableObject(payload), signer, header)
                            */
                            fs.appendFile('../data/duck.txt', response, function (err) {
                                if (err)
                                    throw err;
                                console.log('The file has been saved!');
                            });
                            response = '';
                            return [2 /*return*/];
                    }
                });
            });
        })();
    }, 2000);
});
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
server.listen(3000);
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
// add function for getting public key here...
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
// see https://github.com/decentralized-identity/did-jwt/issues/226 ,https://github.com/decentralized-identity/did-jwt/issues/229
// I removed the encodeDID function
// export function encodeDID(publicKey: Uint8Array): string { }
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
//export class P256Provider 
// is there something like an asyncchronous class so I can use asynchronous function calls in the constructor?
var P256Provider = /** @class */ (function () {
    function P256Provider(stream, did) {
        var _this = this;
        // check that did is valid with RPC request with chip
        // if there is no did (e.g. did:key the code should create the did:key from a public key of the cryptochip ... if there is no public key...fail gracefully)
        /*
        const multicodecName = 'p256-pub';
        */
        // this raw public key may be stored somewhere, but initially it needs to be pulled over the wire from the cryptochip ... see remotePublicKey.ts
        /*
        const rawPublicKey = 'f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f';
        const compressedKey = compressedKeyInHexfromRaw(rawPublicKey);
        const did = encodeDIDfromHexString(multicodecName ,compressedKey);
        */
        // I don't know how async function calls will work with conditionals and the constructor
        /*
          if(matchDIDKeyWithRemote() === true) {
               did = did;
             } else {
               const multicodecName = 'p256-pub';
                   try {
                did = encodeDIDfromHexString(multicodecName,compressedKeyInHexfromRaw(getPublicKey()));
            } catch (ex) {
                console.log("async failed with", ex);
            }
          }
        */
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
            var DIDKeyExists, publicKey;
            return __generator(this, function (_a) {
                DIDKeyExists = (function () {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, matchDIDKeyWithRemote(did, stream)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); });
                })();
                publicKey = (function () {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getPublicKey(stream)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); });
                })();
                DIDKeyExists.then(function (result) {
                    if (result == true) {
                        did = did;
                    }
                    else {
                        var multicodecName_1 = 'p256-pub';
                        try {
                            publicKey.then(function (resultTwo) { did = (0, did_key_creator_1.encodeDIDfromHexString)(multicodecName_1, (0, did_key_creator_1.compressedKeyInHexfromRaw)(resultTwo)); });
                        }
                        catch (ex) {
                            console.log("async failed with", ex);
                        }
                    }
                });
                return [2 /*return*/, new P256Provider(stream, did)];
            });
        });
    };
    Object.defineProperty(P256Provider.prototype, "isDidProvider", {
        /*
            if( DIDKeyExists === true) {
              did = did;
              } else {
                 const multicodecName = 'p256-pub';
                try {
                      did = encodeDIDfromHexString(multicodecName,compressedKeyInHexfromRaw(publicKey));
                } catch (ex) {
                      console.log("async failed with", ex);
            }
           }
            return new P256Provider(stream,did);
          }
          */
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
        var compressedPublicKey, publicKey, publicRawKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    compressedPublicKey = (0, did_key_creator_1.didKeyURLtoPubKeyHex)(didkeyURL);
                    publicKey = nist_weierstrass.nist_weierstrauss_common.publicKeyIntToUint8ArrayPointPair(nist_weierstrass.secp256r1.ECPointDecompress((0, from_string_1.fromString)(compressedPublicKey, 'base16')));
                    publicRawKey = octetToRaw(publicKey);
                    return [4 /*yield*/, matchPublicKeyWithRemote(publicRawKey, stream)];
                case 1: return [2 /*return*/, _a.sent()];
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
                    // I am not sure what the return packet will look like, but it may be a 0 or 1...
                    if (result === '1') {
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function octetToRaw(publicKey) {
    return (0, to_string_1.toString)(publicKey.xOctet, 'hex') + (0, to_string_1.toString)(publicKey.yOctet, 'hex');
}
/*
function octetToRaw(publicKey: keydidresolver.octetPoint) {
   return toString(publicKey.xOctet,'hex')+toString(publicKey.yOctet,'hex')
}
*/
function getPublicKey(stream) {
    return __awaiter(this, void 0, void 0, function () {
        var rpcPayload, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpcPayload = '2' + '1200';
                    stream.write(rpcPayload);
                    return [4 /*yield*/, waitForEvent(stream, 'data')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
