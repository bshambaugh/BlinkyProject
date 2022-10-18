import type { DIDMethodName, DIDProviderMethods, DIDProvider } from 'dids';
import type { RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils';
export declare class P256Provider implements DIDProvider {
    _handle: SendRequestFunc<DIDProviderMethods>;
    constructor(stream: any, did: any);
    static build(stream: any, did: any): Promise<P256Provider>;
    get isDidProvider(): boolean;
    send<Name extends DIDMethodName>(msg: RPCRequest<DIDProviderMethods, Name>): Promise<RPCResponse<DIDProviderMethods, Name> | null>;
}
//# sourceMappingURL=did-jwt-issue229_try4.d.ts.map