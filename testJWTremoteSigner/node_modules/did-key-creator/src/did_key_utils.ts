import * as u8a from 'uint8arrays'
import multicodec from 'multicodec'
import { base58btc } from 'multiformats/bases/base58'

/**
 *  compress a public key with points x,y expressed as UintArrays
 * source: https://stackoverflow.com/questions/17171542/algorithm-for-elliptic-curve-point-compression
 *
 *  @param {Uint8Array}  x  x point of public key
 *  @param {Uint8Array}  y  y point of public key
 *  @return {Uint8Array} compressed form of public key as Uint8Array
 */
export function ECPointCompress(x: Uint8Array, y: Uint8Array): Uint8Array {
  const out = new Uint8Array(x.length + 1)

  out[0] = 2 + (y[y.length - 1] & 1)
  out.set(x, 1)

  return out
}

/**
 *  create a compressed public key in hex from a raw public key in hex
 *
 *  @example
 *  compressedKeyInHexfromRaw('f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f')
 *
 *  @param {string} publicKeyHex raw key as hex string with just x and y points and no '04' prefix
 *  @return {string} compressed key as hex string with '02' prefix for even and '03' prefix for odd y point value
 */
export function compressedKeyInHexfromRaw(publicKeyHex: string): string {
  const xHex = publicKeyHex.slice(0, publicKeyHex.length / 2)
  const yHex = publicKeyHex.slice(publicKeyHex.length / 2, publicKeyHex.length)

  const xOctet = u8a.fromString(xHex, 'base16')
  const yOctet = u8a.fromString(yHex, 'base16')

  const compressedPoint = ECPointCompress(xOctet, yOctet)
  const compressedPointHex = u8a.toString(compressedPoint, 'base16')
  return compressedPointHex
}

/**
 *  create an uncompressed public key from a raw public key in hex
 *
 *  @example
 *  uncompressedKeyInHexfromRaw('f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f')
 *
 *  @param {string} publicKeyHex raw key with x and y points and no '04' prefix
 *  @return {string} uncompressed key with x and y points and '04' prefix
 */
export function uncompressedKeyInHexfromRaw(publicKeyHex: string): string {
  return '04' + publicKeyHex
}

/**
 *  create a raw public key from a uncompressed public key in hex, e.g. remote the '04' prefix
 *
 *  @example
 *  rawKeyInHexfromUncompressed('04f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f')
 *
 *  @param {string} publicKeyHex uncompressed key with x and y points and '04' prefix
 *  @return {string} raw key with x and y points and no '04' prefix
 */
export function rawKeyInHexfromUncompressed(publicKeyHex: string): string {
  return publicKeyHex.slice(2)
}

/**
 *  convert a raw public key (no '04' prefix for uncompressed, no '02' or '03' prefix for compressed) to a UintArray
 *
 *  @example
 *  pubKeyHexToUint8Array('f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f')
 *
 *  @param {string} publicKeyHex raw public key with x and y points and no '04' prefix
 *  @return {Uint8Array} raw public key expressed as Uint8Array
 */
export function pubKeyHexToUint8Array(publicKeyHex: string): Uint8Array {
  if (publicKeyHex == null) {
    throw new TypeError('input cannot be null or undefined.')
  }
  if (publicKeyHex.length % 2 === 0) {
    return u8a.fromString(publicKeyHex, 'base16')
  } else {
    return u8a.fromString('0' + publicKeyHex, 'base16')
  }
}

/**
 *  pull the id from a did:key in the format did:key:id
 *
 *  @example
 *  didKeyIDtoPubKeyHex('zruuPojWkzGPb8sVc42f2YxcTXKUTpAUbdrzVovaTBmGGNyK6cGFaA4Kp7SSLKecrxYz8Sc9d77Rss7rayYt1oFCaNJ')
 *
 *  @param {string} didKeyID did:key id in base58 with form did:key:id
 *  @return {string} raw public key with x and y points and no '04' prefix
 */
export function didKeyIDtoPubKeyHex(didKeyID: string): string {
  const buf = base58btc.decode(didKeyID)
  const bufwoPrefix = multicodec.rmPrefix(buf)
  return u8a.toString(bufwoPrefix, 'base16')
}

/**
 *  input a did:key and pull out the public key in hex
 *
 *   @example
 *   didKeyURLtoPubKeyHex('did:key:zruuPojWkzGPb8sVc42f2YxcTXKUTpAUbdrzVovaTBmGGNyK6cGFaA4Kp7SSLKecrxYz8Sc9d77Rss7rayYt1oFCaNJ')
 *
 *   @param {string} didKeyURL did:key in form did:key:id
 *   @return {string} raw public key with x and y points and no '04' prefix
 */
export function didKeyURLtoPubKeyHex(didKeyURL: string): string {
  const didKeyID = didKeyURL.split(':')[2]
  return didKeyIDtoPubKeyHex(didKeyID)
}
