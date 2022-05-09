import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'

var ec = new EC.ec('p256');

const value = 'howdy';

function bytesToBase64url(b: Uint8Array) {
  return u8a.toString(b, 'base64url')
}

async function callToHSM(value: string): Promise<Uint8Array> {
    
    const privateKey = '0x040f1dbf0a2ca86875447a7c010b0fc6d39d76859c458fbe8f2bf775a40ad74a'
    const keypairTemp = ec.keyFromPrivate(privateKey)
    const buffferMsg = Buffer.from(value)
    let hexSig = keypairTemp.sign(buffferMsg)
    const xOctet = u8a.fromString(hexSig.r.toString(),'base10');
    const yOctet = u8a.fromString(hexSig.s.toString(),'base10');
    const hexR = u8a.toString(xOctet,'base16');
    const hexS = u8a.toString(yOctet,'base16');
    return u8a.fromString(hexR+hexS,'hex');
   
}

async function JsonWebToken(value: string): Promise<string> {
 const signatureBytes = await callToHSM(value)
 return bytesToBase64url(signatureBytes)
}

//const stringOrNullWeird: () => Promise<string> = async ()
let signer = async () => { await JsonWebToken(value) }

async function JsonWebTokenT() {
  let jwt = await didJWT.createJWT(
     { aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', exp: 1957463421, name: 'uPort Developer' },
     { issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer }//,
    // { alg: 'ES256' }
  )
  console.log(jwt)
}

JsonWebTokenT()

