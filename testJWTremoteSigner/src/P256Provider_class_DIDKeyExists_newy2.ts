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
import { DiffieHellman } from 'crypto'

const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
    //stream.read();
    stream.setEncoding('utf8');
// const did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
 const did = 'did:key:zDnaezUFn4zmNoNeZvBEdVyCv6MVL69X8NRD8YavTCJWGuXM7';
/*
const provider = P256Provider.build(stream,did);
console.log(provider);
*/
setInterval(function(){
  (async function() {
    
          // this returns the did given as an argument if it matches the remote, otherwise it gives the remote did
          const DIDKeyExists = await matchDIDKeyWithRemote(did,stream);  // make sure this logically works (test it alone)
     
          console.log('DIDKeyExists is:'+DIDKeyExists);        
    
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

   // I think that I have to close some listeners here....because I get to the maxListner limit
   async function waitForEvent(emitter, event): Promise<string> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");  /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
    });
  }  

  async function matchDIDKeyWithRemote(didkeyURL: string,stream: any) : Promise<string> {
    const compressedPublicKey = didKeyURLtoPubKeyHex(didkeyURL);
   // console.log(compressedPublicKey);
    const publicKey = publicKeyIntToUint8ArrayPointPair(ECPointDecompress(fromString(compressedPublicKey,'hex'))); // actually I need to create a function called compressed to raw
   // console.log(publicKey);
    const publicRawKey = octetToRaw(publicKey)
   // console.log(publicRawKey);
    let result = await matchPublicKeyWithRemote(publicRawKey,stream)
    if(result.length > 1) {
      return rpcToDID(result);
     } else {
       return didkeyURL;
     }
  }
  
  async function matchPublicKeyWithRemote(publicKey: string,stream: any) : Promise<string> {
    let rpcPayload = '0'+'1200'+publicKey;
    stream.write(rpcPayload);
   // console.log('rpcpaylod'+rpcPayload);
    let result = await waitForEvent(stream,'data');  
   // console.log('result is:'+result);
    return result; 
  }
  
  function octetToRaw(publicKey: octetPoint) {
     return toString(publicKey.xOctet,'hex')+toString(publicKey.yOctet,'hex')
  }
  
  function rpcToDID(response) : string {
    let result = response.split(',');
    //compressedKeyInHexfromRaw(result[1])
    // return result[1];
    const multicodecName = 'p256-pub';
    return encodeDIDfromHexString(multicodecName,compressedKeyInHexfromRaw(result[1]))
}