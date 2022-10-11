import * as didJWT from 'did-jwt'
const audAddress = '0x20c769ec9c0996ba7737a4826c2aaff00b1b2040'
const aud = `did:ethr:${audAddress}`
const publicKey = '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479'
const address = '0xf3beac30c498d9e26865f34fcaa57dbb935b0d74'
const did = `did:ethr:${address}`
const didDoc = {
    didDocument: {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: publicKey,
        },
      ],
      authentication: [`${did}#keys-1`],
      assertionMethod: [`${did}#keys-1`],
      capabilityInvocation: [`${did}#keys-1`],
      capabilityDelegation: [`${did}#some-key-that-does-not-exist`],
    },
  }
  const audDidDoc = {
    didDocument: {
      '@context': 'https://w3id.org/did/v1',
      id: aud,
      verificationMethod: [
        {
          id: `${aud}#keys-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: publicKey,
        },
      ],
      authentication: [`${aud}#keys-1`],
      assertionMethod: [`${aud}#keys-1`],
      capabilityInvocation: [`${aud}#keys-1`],
      capabilityDelegation: [`${aud}#some-key-that-does-not-exist`],
    },
  }
  /*
const resolver = {
    resolve: jest.fn().mockImplementation((didUrl: string) => {
      if (didUrl.includes(did)) {
        return {
          didDocument: didDoc.didDocument,
          didDocumentMetadata: {},
          didResolutionMetadata: { contentType: 'application/did+ld+json' },
        }
      }

      if (didUrl.includes(aud)) {
        return {
          didDocument: audDidDoc.didDocument,
          didDocumentMetadata: {},
          didResolutionMetadata: { contentType: 'application/did+ld+json' },
        }
      }

      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: 'notFound',
          message: 'resolver_error: DID document not found',
        },
      }
    }),
  }
  */
const incomingJwt =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE0ODUzMjExMzMsInJlcXVlc3RlZCI6WyJuYW1lIiwicGhvbmUiXSwiaXNzIjoiZGlkOmV0aHI6MHhmM2JlYWMzMGM0OThkOWUyNjg2NWYzNGZjYWE1N2RiYjkzNWIwZDc0In0.tU96omPNxCfQoEADOpLywXUDCMjKXOfTaG61EZwmfvHJrDFQhNbSDzCP2Pe7WdXySosTCuI1T-IQ6SddcWuj_A'
//didJWT.verifyJWT(incomingJwt, { resolver, proofPurpose: 'impossible' }))

didJWT.verifyJWT(incomingJwt, {  })