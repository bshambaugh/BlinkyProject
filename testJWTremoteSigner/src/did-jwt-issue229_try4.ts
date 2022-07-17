import * as didJWT from 'did-jwt'
import { Signer } from 'did-jwt'
import { createJWS } from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
//import * as WebSocket from 'ws'
import * as WebSocket from 'websocket-stream'
import { Stream } from 'stream'
import * as fs from 'fs'
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
import * as keydidresolver from '/home/ubuntu/Downloads/nov22nd/js-ceramic/packages/key-did-resolver/lib/index.js'  // I cannot import this ...
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'

//import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';

/**************************websocket_example.js*************************************************/
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****

//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
   //stream.read();
   stream.setEncoding('utf8');

   const string = '2'+'1200'+'f958a'; 
   /*
   var interval = setInterval(function(){
    stream.write(string, () => console.log('I am a penguin' ));
   // writer(stream,string);
  }, 2000);
  */

setInterval(function(){
  (async function() {
    
    //stream.write(string);
    // getSignature(stream,string);
    let response = await getSignature(stream,string);
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

    fs.appendFile('../data/duck.txt',response, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    
    response = '';

  })();
},2000);

})

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

server.listen(3000);

function remoteP256Signer(stream): Signer {
  return async (payload: string | Uint8Array): Promise<string> => {
    return await getSignature(stream,payload);
   }
}

// add function for getting public key here...

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


// see https://github.com/decentralized-identity/did-jwt/issues/226 ,https://github.com/decentralized-identity/did-jwt/issues/229


// I removed the encodeDID function
// export function encodeDID(publicKey: Uint8Array): string { }

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
//export class P256Provider 
// is there something like an asyncchronous class so I can use asynchronous function calls in the constructor?
export class P256Provider implements DIDProvider {
  _handle: SendRequestFunc<DIDProviderMethods>

  constructor(stream,did) {
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
    const handler = createHandler<Context, DIDProviderMethods>(didMethods)
    // this code has to check whether the did is valid for the remote ... but does the logic have to be here??
    this._handle = async (msg) => await handler({ did, stream }, msg)
  }

  
  public static async build(stream,did): Promise<P256Provider> {

    // I don't know how to use these in the code below, because both remain promises
    // maybe I should use promise chaining with conditionals .... then wrap it all with await
    /*    const myClassInstance = await MyClass.build()
    * return myClassInstance;
    */

    const DIDKeyExists = (async function() { return await matchDIDKeyWithRemote(did,stream) })(); /// returns 1 if exists, 0 if not ?
    const publicKey = (async function() { return await getPublicKey(stream) })(); // gets the public key

    DIDKeyExists.then(function(result) { if(result == true){
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
  const publicKey = keydidresolver.nist_weierstrass_common.publicKeyIntToUint8ArrayPointPair(keydidresolver.secp256r1.ECPointDecompress(fromString(compressedPublicKey,'base16'))); // actually I need to create a function called compressed to raw
  // octetToRaw == 
  /*
  interface octetPoint {
    xOctet: Uint8Array,
    yOctet: Uint8Array
  }
  */ 
  // (xOctet --> hexString) + (yOctect --> hexString) -- u8a.toString
  //const publicKey = octetToRaw(publicKeyIntToUint8ArrayPointPair(ECPointDecompress(fromString(compressedPublicKey,'base16'))));
  //const publicKey = // compressedToRaw(compressedPublicKey) function that converts a compressed key to a raw key
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

function octetToRaw(publicKey: keydidresolver.octetPoint) {
   return toString(publicKey.xOctet,'hex')+toString(publicKey.yOctet,'hex')
}

async function getPublicKey(stream) : Promise<string> {
  /// look at the RPC call to get the public key
  let rpcPayload = '2'+'1200';
  stream.write(rpcPayload);
  let result = await waitForEvent(stream,'data');
  return result;
}