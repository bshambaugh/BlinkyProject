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
const didJWT = __importStar(require("did-jwt"));
const audAddress = '0x20c769ec9c0996ba7737a4826c2aaff00b1b2040';
const aud = `did:ethr:${audAddress}`;
const publicKey = '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479';
const address = '0xf3beac30c498d9e26865f34fcaa57dbb935b0d74';
const did = `did:ethr:${address}`;
const didDoc = {
    didDocument: {
        '@context': 'https://w3id.org/did/v1',
        id: did,
        verificationMethod: [
            {
                id: `${did}#keys-1`,
                type: 'EcdsaSecp256k1VerificationKey2019',
                controller: did,
                publicKeyHex: publicKey,
            },
        ],
        authentication: [`${did}#keys-1`],
        assertionMethod: [`${did}#keys-1`],
        capabilityInvocation: [`${did}#keys-1`],
        capabilityDelegation: [`${did}#some-key-that-does-not-exist`],
    },
};
const audDidDoc = {
    didDocument: {
        '@context': 'https://w3id.org/did/v1',
        id: aud,
        verificationMethod: [
            {
                id: `${aud}#keys-1`,
                type: 'EcdsaSecp256k1VerificationKey2019',
                controller: did,
                publicKeyHex: publicKey,
            },
        ],
        authentication: [`${aud}#keys-1`],
        assertionMethod: [`${aud}#keys-1`],
        capabilityInvocation: [`${aud}#keys-1`],
        capabilityDelegation: [`${aud}#some-key-that-does-not-exist`],
    },
};
const incomingJwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE0ODUzMjExMzMsInJlcXVlc3RlZCI6WyJuYW1lIiwicGhvbmUiXSwiaXNzIjoiZGlkOmV0aHI6MHhmM2JlYWMzMGM0OThkOWUyNjg2NWYzNGZjYWE1N2RiYjkzNWIwZDc0In0.tU96omPNxCfQoEADOpLywXUDCMjKXOfTaG61EZwmfvHJrDFQhNbSDzCP2Pe7WdXySosTCuI1T-IQ6SddcWuj_A';
didJWT.verifyJWT(incomingJwt, {});
//# sourceMappingURL=testJwt.js.map