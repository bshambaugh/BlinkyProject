interface octetPoint {
    xOctet: Uint8Array;
    yOctet: Uint8Array;
}
interface BigIntPoint {
    x: BigInt;
    y: BigInt;
}
export declare function testUint8Array(param: Uint8Array): boolean;
export declare function ECPointDecompress(comp: Uint8Array): BigIntPoint;
export declare function publicKeyIntToUint8ArrayPointPair(ecpoint: BigIntPoint): octetPoint;
export {};
//# sourceMappingURL=P256Provider_class_DIDKeyExists.d.ts.map