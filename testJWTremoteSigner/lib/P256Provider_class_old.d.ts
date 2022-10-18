import type { DIDMethodName, DIDProviderMethods, DIDProvider } from 'dids';
import type { RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils';
interface octetPoint {
    xOctet: Uint8Array;
    yOctet: Uint8Array;
}
interface BigIntPoint {
    x: BigInt;
    y: BigInt;
}
export declare function publicKeyIntToUint8ArrayPointPair(ecpoint: BigIntPoint): octetPoint;
export declare function testUint8Array(param: Uint8Array): boolean;
export declare function ECPointDecompress(comp: Uint8Array): BigIntPoint;
export declare class P256Provider implements DIDProvider {
    _handle: SendRequestFunc<DIDProviderMethods>;
    private constructor();
    static build(stream: any, did: any): Promise<P256Provider>;
    get isDidProvider(): boolean;
    send<Name extends DIDMethodName>(msg: RPCRequest<DIDProviderMethods, Name>): Promise<RPCResponse<DIDProviderMethods, Name> | null>;
}
export {};
//# sourceMappingURL=P256Provider_class_old.d.ts.map