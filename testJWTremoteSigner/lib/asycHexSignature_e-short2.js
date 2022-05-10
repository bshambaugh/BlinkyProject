"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const didJWT = __importStar(require("did-jwt"));
const u8a = __importStar(require("uint8arrays"));
const EC = __importStar(require("elliptic"));
var ec = new EC.ec('p256');
function bytesToBase64url(b) {
    return u8a.toString(b, 'base64url');
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
    return u8a.fromString(hexR + hexS, 'hex');
}
async function JsonWebToken(value) {
    return bytesToBase64url(callToHSM(value));
}
function signer() {
    const value = 'howdy';
    return JsonWebToken(value);
}
async function JsonWebTokenT() {
    let jwt = await didJWT.createJWT({ aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', exp: 1957463421, name: 'uPort Developer' }, { issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer });
    console.log(jwt);
}
JsonWebTokenT();
//# sourceMappingURL=asycHexSignature_e-short2.js.map