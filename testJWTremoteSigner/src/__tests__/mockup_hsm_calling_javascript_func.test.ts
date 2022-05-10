import * as mapper from "../mockup_hsm_calling_javascript_func"
import * as u8a from 'uint8arrays'

describe('testJWT mapper', () => {
 it('test codeToHSM', async () => {
    const valueString = 'howdy';
    const value = u8a.fromString(valueString);
    expect(mapper.callToHSM(value)).toMatchSnapshot()
  })
})
