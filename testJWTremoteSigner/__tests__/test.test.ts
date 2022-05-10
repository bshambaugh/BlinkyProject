import { JsonWebTokenT, signer } from '../src/mockup_hsm_calling_javascript_func';

describe('it should return true', () => {
  it('Signer should returned a signed value from jwt, maybe?', async () => {
    const sig = signer('howdy')()
    expect(sig).toBe('3pC2F4o1mDPRM_RbVvesenWyTK4oRNNZkpEP4pTR__1mtY3Ba5HOFpB-8sWYUFXi5_C8TbWSYrJB-DNLUHf9_Q')
  });

  it('should return true', async () => {
    const generatedDIDJWT = await JsonWebTokenT('howdy')
    expect(typeof generatedDIDJWT).toBe('string')
  });
  
})
