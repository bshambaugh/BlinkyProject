export interface BigIntPoint {
    x: BigInt;
    y: BigInt;
}
export interface base64urlPoint {
    xm: string;
    ym: string;
}
export interface octetPoint {
    xOctet: Uint8Array;
    yOctet: Uint8Array;
}
export declare function pubKeyBytesToHex(pubKeyBytes: Uint8Array): string;
export declare function publicKeyToXY(publicKeyHex: string): base64urlPoint;
export declare function publicKeyHexToUint8ArrayPointPair(publicKeyHex: string): octetPoint;
export declare function testHexString(str: string): boolean;
export declare function testUint8Array(param: Uint8Array): boolean;
export declare function publicKeyIntToXY(ecpoint: BigIntPoint): base64urlPoint;
export declare function publicKeyIntToUint8ArrayPointPair(ecpoint: BigIntPoint): octetPoint;
//# sourceMappingURL=nist-weierstrauss-common.d.ts.map