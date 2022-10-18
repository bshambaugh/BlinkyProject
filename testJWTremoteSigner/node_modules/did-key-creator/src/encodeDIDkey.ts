import * as u8a from 'uint8arrays'
import multicodec from 'multicodec'
import { base58btc } from 'multiformats/bases/base58'
import { CodecName } from 'multicodec/src/generated-types'

/**
 *  Encodes a did:key from a hex string
 *
 *  @example
 *  encodeDIDfromHexString('p256-pub','f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f')
 *
 *  @param    {CodecName}           multicodecName   see https://github.com/multiformats/multicodec/blob/master/table.csv for a list of names
 *  @param    {string}              publicKeyHex     public key expressed as hex string
 *  @return   {string}                               a did:key, see spec https://w3c-ccg.github.io/did-method-key/ for form
 */
export function encodeDIDfromHexString(multicodecName: CodecName, publicKeyHex: string): string {
  const publicKey = u8a.fromString(publicKeyHex, 'base16')
  const didKey = encodeDIDfromBytes(multicodecName, publicKey)
  return didKey
}

/**
 *  Encodes a did:key from bytes
 *
 *  @example
 *  eencodeDIDfromBytes('p256-pub',new Uint8Array([...])) , or see index.test.ts for constructing Uint8Arrays from strings
 *
 *  @param    {CodecName}           multicodecName   see https://github.com/multiformats/multicodec/blob/master/table.csv for a list of names
 *  @param    {Uint8Array}              publicKey    public key expressed as byte Array
 *  @return   {string}                               a did:key, see spec https://w3c-ccg.github.io/did-method-key/ for form
 */
export function encodeDIDfromBytes(multicodecName: CodecName, publicKey: Uint8Array): string {
  const publicKeywPrefix = multicodec.addPrefix(multicodecName, publicKey)
  const bufAsString = base58btc.encode(publicKeywPrefix)
  return `did:key:${bufAsString}`
}
