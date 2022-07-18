import { Signer } from 'did-jwt'
import { createJWS } from 'did-jwt'
import stringify from 'fast-json-stable-stringify'
import type {
  AuthParams,
  CreateJWSParams,
  DIDMethodName,
  DIDProviderMethods,
  DIDProvider,
  GeneralJWS,
} from 'dids'
import { RPCError, createHandler } from 'rpc-utils'
import type { HandlerMethods, RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils'
import { encodeDIDfromHexString, compressedKeyInHexfromRaw, didKeyURLtoPubKeyHex } from 'did-key-creator'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import * as u8a from 'uint8arrays'
import * as http from 'http'
import * as WebSocket from 'websocket-stream'

import KeyResolver from '@ceramicnetwork/key-did-resolver'
import { DID } from 'dids'

const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
    //stream.read();
    stream.setEncoding('utf8');
const did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
/*
const provider = P256Provider.build(stream,did);
console.log(provider);
*/
setInterval(function(){
  (async function() {
    
    const provider = P256Provider.build(stream,did);
    console.log(provider);
   // Creating the DID class doesn't work well with a promise, commenting out for now...
    /*
    const resolvedProvider = (await provider).send
    console.log(resolvedProvider) // I tried putting resolvedProvider in the place of provider, but I don't know how to fix the send requirement.
    const didObject = new DID({ provider , resolver: KeyResolver.getResolver() })
    */
  })();
},250);

})

server.listen(3000);

/**
  * Elliptic curve point with coordinates expressed as byte arrays (Uint8Array)
  */
 interface octetPoint {
    xOctet: Uint8Array,
    yOctet: Uint8Array
  }

  /**
  * x,y point as a BigInt (requires at least ES2020)
  * For BigInt see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
  */
interface BigIntPoint {
    x: BigInt,
    y : BigInt
 }

/**
 * 
 * @param ecpoint -  Public key.
 * @returns Uint8Array with bytes as base10
 * @throws TypeError: input cannot be null or undefined.
 * @throws Error: Input coordinates must be BigInt
 * @throws Error: Input must have properties x and y
 * @throws TypeError: Input must be an object with properties x and y
 */
export function publicKeyIntToUint8ArrayPointPair(ecpoint: BigIntPoint) : octetPoint {
    if(ecpoint == null) { throw new TypeError('input cannot be null or undefined.'); }

    if(typeof ecpoint !== "object") { throw new TypeError("Input must be an object with properties x and y"); }

    if(!Object.prototype.hasOwnProperty.call(ecpoint, "x") ||  !Object.prototype.hasOwnProperty.call(ecpoint, "y")) { throw new Error("Input must have properties x and y"); }

    if(typeof ecpoint.x !== "bigint" &&  typeof ecpoint.y !== "bigint") { throw new Error("Input coordinates must be BigInt");  }

      const xHex = (ecpoint.x).toString();
      const yHex = (ecpoint.y).toString();
      const xOctet = u8a.fromString(xHex,'base10');
      const yOctet = u8a.fromString(yHex,'base10');
      return { xOctet, yOctet };
}

/**
 * Test to see if the argument is the Uint8Array
 * @param param
 * @returns
 */
 export function testUint8Array(param: Uint8Array) : boolean {
    if(param == null) {
       return false;
    }
    if(param.constructor === Uint8Array) {
       return true;
    } else {
       return false;
    }
  }

/**
 * Decompress a compressed public key in SEC format.
 * See section 2.3.3 in SEC 1 v2 : https://www.secg.org/sec1-v2.pdf.
 *
 * Code based on: https://stackoverflow.com/questions/17171542/algorithm-for-elliptic-curve-point-compression/30431547#30431547
 *
 * @param - 33 byte compressed public key. 1st byte: 0x02 for even or 0x03 for odd. Following 32 bytes: x coordinate expressed as big-endian.
 * @throws TypeError: input cannot be null or undefined.
 */
 export function ECPointDecompress( comp : Uint8Array ) : BigIntPoint {
    if(!testUint8Array(comp)) {
      throw new TypeError('input must be a Uint8Array');
     }
    // two, prime, b, and pIdent are constants for the P-256 curve
    const two = BigInt(2);
    const prime = (two ** 256n) - (two ** 224n) + (two ** 192n) + (two ** 96n) - 1n;
    const b = 41058363725152142129326129780047268409114441015993725554835256314039467401291n;
    const pIdent = (prime + 1n) / 4n;
  
    const signY = BigInt(comp[0] - 2);
    const x = comp.subarray(1);
    const xBig = BigInt(u8a.toString(x,'base10'));
  
    const a = xBig**3n - xBig*3n + b;
    let yBig = modPow(a,pIdent,prime);
  
    // "// If the parity doesn't match it's the *other* root"
    if( yBig % 2n !== signY)
      {
           // y = prime - y
           yBig = prime - yBig;
      }
  
      return {
        x: xBig,
        y: yBig
      };
  
  }

  /// Copy of `modPow` function from `https://github.com/juanelas/bigint-mod-arith`.
/// The package is not quite ready to be used in production as ES module.
/// See https://github.com/juanelas/bigint-mod-arith/pull/6
/// TODO Replace this with original `bigint-mod-arith` package, once the linked PR is merged and released.

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 *
 * @remarks
 * a and b must be the same type, either number or bigint
 *
 * @param a - An integer
 * @param n - The modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns A bigint with the smallest positive representation of a modulo n
 */
function toZn (a: number|bigint, n: number|bigint): bigint {
    if (typeof a === 'number') a = BigInt(a)
    if (typeof n === 'number') n = BigInt(n)
  
    if (n <= 0n) {
      throw new RangeError('n must be > 0')
    }
  
    const aZn = a % n
    return (aZn < 0n) ? aZn + n : aZn
  }
  
  interface Egcd {
    g: bigint
    x: bigint
    y: bigint
  }
  /**
   * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
   * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
   *
   * @param a
   * @param b
   *
   * @throws {RangeError}
   * This excepction is thrown if a or b are less than 0
   *
   * @returns A triple (g, x, y), such that ax + by = g = gcd(a, b).
   */
  function eGcd (a: number|bigint, b: number|bigint): Egcd {
    if (typeof a === 'number') a = BigInt(a)
    if (typeof b === 'number') b = BigInt(b)
  
    if (a <= 0n || b <= 0n) throw new RangeError('a and b MUST be > 0') // a and b MUST be positive
  
    let x = 0n
    let y = 1n
    let u = 1n
    let v = 0n
  
    while (a !== 0n) {
      const q = b / a
      const r: bigint = b % a
      const m = x - (u * q)
      const n = y - (v * q)
      b = a
      a = r
      x = u
      y = v
      u = m
      v = n
    }
    return {
      g: b,
      x: x,
      y: y
    }
  }
  
  /**
   * Modular inverse.
   *
   * @param a The number to find an inverse for
   * @param n The modulo
   *
   * @throws {RangeError}
   * Excpeption thorwn when a does not have inverse modulo n
   *
   * @returns The inverse modulo n
   */
  function modInv (a: number|bigint, n: number|bigint): bigint {
    const egcd = eGcd(toZn(a, n), n)
    if (egcd.g !== 1n) {
      throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`) // modular inverse does not exist
    } else {
      return toZn(egcd.x, n)
    }
  }
  
  /**
   * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
   *
   * @param a
   *
   * @returns The absolute value of a
   */
  function abs (a: number|bigint): number|bigint {
    return (a >= 0) ? a : -a
  }
  
  /**
   * Modular exponentiation b**e mod n. Currently using the right-to-left binary method
   *
   * @param b base
   * @param e exponent
   * @param n modulo
   *
   * @throws {RangeError}
   * Excpeption thrown when n is not > 0
   *
   * @returns b**e mod n
   */
 function modPow (b: number|bigint, e: number|bigint, n: number|bigint): bigint {
    if (typeof b === 'number') b = BigInt(b)
    if (typeof e === 'number') e = BigInt(e)
    if (typeof n === 'number') n = BigInt(n)
  
    if (n <= 0n) {
      throw new RangeError('n must be > 0')
    } else if (n === 1n) {
      return 0n
    }
  
    b = toZn(b, n)
  
    if (e < 0n) {
      return modInv(modPow(b, abs(e), n), n)
    }
  
    let r = 1n
    while (e > 0) {
      if ((e % 2n) === 1n) {
        r = r * b % n
      }
      e = e / 2n
      b = b ** 2n % n
    }
    return r
  }

async function getSignature(stream,string) {
    stream.write(string);
    let result = await waitForEvent(stream,'data');
    //console.log(result);
    return result;
  }
  
  // I think that I have to close some listeners here....because I get to the maxListner limit
  async function waitForEvent(emitter, event): Promise<string> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");  /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
    });
  }

function remoteP256Signer(stream): Signer {
    return async (payload: string | Uint8Array): Promise<string> => {
      return await getSignature(stream,payload);
     }
  }
  
  const sign = async (
    payload: Record<string, any> | string,
    stream,
    did: string,
    protectedHeader: Record<string, any> = {}
  ) => {
    const kid = `${did}#${did.split(':')[2]}`
    const signer = remoteP256Signer(stream) // see remoteP256Signer.ts // const signer = EdDSASigner(secretKey)
    const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256' }))  /// see https://datatracker.ietf.org/doc/html/rfc7518
    return createJWS(typeof payload === 'string' ? payload : toStableObject(payload), signer, header)
  }
  
  function toStableObject(obj: Record<string, any>): Record<string, any> {
    return JSON.parse(stringify(obj)) as Record<string, any>
  }
  
  function toGeneralJWS(jws: string): GeneralJWS {
    const [protectedHeader, payload, signature] = jws.split('.')
    return {
      payload,
      signatures: [{ protected: protectedHeader, signature }],
    }
  }
  
  interface Context {
    did: string,
    stream: any
  }
  
  const didMethods: HandlerMethods<Context, DIDProviderMethods> = {
    did_authenticate: async ({ did, stream }, params: AuthParams) => {
      const response = await sign(
        {
          did,
          aud: params.aud,
          nonce: params.nonce,
          paths: params.paths,
          exp: Math.floor(Date.now() / 1000) + 600, // expires 10 min from now
        },
        stream,
        did
      )
      return toGeneralJWS(response)
    },
    did_createJWS: async ({ did, stream}, params: CreateJWSParams & { did: string }) => {
      const requestDid = params.did.split('#')[0]
      if (requestDid !== did) throw new RPCError(4100, `Unknown DID: ${did}`)
      const jws = await sign(params.payload, stream, did,  params.protected)
      // const jws = await sign(params.payload, did, secretKey, params.protected)
      return { jws: toGeneralJWS(jws) }
    },
    did_decryptJWE: async () => {
      throw new RPCError(4100, 'Decryption not supported')
    },
  }

export class P256Provider implements DIDProvider {
    _handle: SendRequestFunc<DIDProviderMethods>
  
    private constructor(stream,did) {

      const handler = createHandler<Context, DIDProviderMethods>(didMethods)
      // this code has to check whether the did is valid for the remote ... but does the logic have to be here??
      this._handle = async (msg) => await handler({ did, stream }, msg)
    }
  
    
    public static async build(stream,did): Promise<P256Provider> {
   
      const DIDKeyExists = (async function() { return await matchDIDKeyWithRemote(did,stream) })(); /// returns 1 if exists, 0 if not ?
      const publicKey = (async function() { return await getPublicKey(stream) })(); // gets the public key
  
      DIDKeyExists.then(function(result) { if(result === true){
        did = did;
       } else { 
         const multicodecName = 'p256-pub';
         try {
           publicKey.then(function(resultTwo){ did = encodeDIDfromHexString(multicodecName,compressedKeyInHexfromRaw(resultTwo)); })
         } catch (ex) {
           console.log("async failed with", ex)
         }
       }
       
      })
   
      return new P256Provider(stream,did);
  
    }
  
    get isDidProvider(): boolean {
      return true
    }
  
    async send<Name extends DIDMethodName>(
      msg: RPCRequest<DIDProviderMethods, Name>
    ): Promise<RPCResponse<DIDProviderMethods, Name> | null> {
      return await this._handle(msg)
    }
  }

  async function matchDIDKeyWithRemote(didkeyURL: string,stream: any) : Promise<boolean> {
    const compressedPublicKey = didKeyURLtoPubKeyHex(didkeyURL);
    const publicKey = publicKeyIntToUint8ArrayPointPair(ECPointDecompress(fromString(compressedPublicKey,'base16'))); // actually I need to create a function called compressed to raw
    const publicRawKey = octetToRaw(publicKey)
    return await matchPublicKeyWithRemote(publicRawKey,stream)
  }
  
  async function matchPublicKeyWithRemote(publicKey: string,stream: any) : Promise<boolean> {
    let rpcPayload = '0'+'1200'+publicKey;
    stream.write(rpcPayload);
    let result = await waitForEvent(stream,'data');
    // I am not sure what the return packet will look like, but it may be a 0 or 1...
    if (result === '1') {
        return true;
     } else {
        return false;
    }
  }
  
  function octetToRaw(publicKey: octetPoint) {
     return toString(publicKey.xOctet,'hex')+toString(publicKey.yOctet,'hex')
  }
  
  async function getPublicKey(stream) : Promise<string> {
    /// look at the RPC call to get the public key
    let rpcPayload = '2'+'1200';
    stream.write(rpcPayload);
    let result = await waitForEvent(stream,'data');
    return result;
  }
