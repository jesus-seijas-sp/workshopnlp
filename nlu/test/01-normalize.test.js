const { normalize } = require('../src');

describe('normalize', () => {
  it('Should normalize a string', () => {
    const input = 'Ñam, úh Láh Läh';
    const actual = normalize(input);
    expect(actual).toEqual('nam, uh lah lah');
  });
});
