import * as mapper from "../asycHexSignature_e-short2"
import * as u8a from 'uint8arrays'

describe('testJWT mapper', () => {
 it('test codeToHSM', async () => {
    const valueString = 'howdy';
    const value = u8a.fromString(valueString);
    expect(mapper.callToHSM(value)).toMatchSnapshot()
  })
})
