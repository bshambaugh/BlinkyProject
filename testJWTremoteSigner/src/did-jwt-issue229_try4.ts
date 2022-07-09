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
import { encodeDIDfromHexString, compressedKeyInHexfromRaw } from 'did-key-creator'

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
export class P256Provider implements DIDProvider {
  _handle: SendRequestFunc<DIDProviderMethods>

  constructor(stream) {
    const multicodecName = 'p256-pub';
    // this raw public key may be stored somewhere, but initially it needs to be pulled over the wire from the cryptochip ... see remotePublicKey.ts
    const rawPublicKey = 'f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f';
    const compressedKey = compressedKeyInHexfromRaw(rawPublicKey);
    const did = encodeDIDfromHexString(multicodecName ,compressedKey);
    const handler = createHandler<Context, DIDProviderMethods>(didMethods)
    // this code has to check whether the did is valid for the remote ... but does the logic have to be here??
    this._handle = async (msg) => await handler({ did, stream }, msg)
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
