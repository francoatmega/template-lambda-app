import { parseJSON } from '../../src/utils';

describe('json util', () => {
  it('should succesfully parse a payload', () => {
    const payload = '{ "test": 1 }';

    const result = parseJSON(payload);

    expect(result).toEqual({ test: 1 });
  });

  it('should return null when parsing an invalid payload', () => {
    const payload = 'test123';

    const result = parseJSON(payload);

    expect(result).toEqual(null);
  });
});
