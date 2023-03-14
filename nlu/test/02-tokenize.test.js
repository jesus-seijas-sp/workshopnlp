const { tokenize } = require('../src');

describe('Tokenize', () => {
  it('Should tokenize a sentence', () => {
    const input = 'what does your company develop';
    const expected = ['what', 'does', 'your', 'company', 'develop'];
    const actual = tokenize(input);
    expect(actual).toEqual(expected);
  });
  it('Should respect case', () => {
    const input = 'What Does Your company develop';
    const expected = ['What', 'Does', 'Your', 'company', 'develop'];
    const actual = tokenize(input);
    expect(actual).toEqual(expected);
  });
  it('Should remove separator characters', () => {
    const input = 'what, does, your, company. develop?';
    const expected = ['what', 'does', 'your', 'company', 'develop'];
    const actual = tokenize(input);
    expect(actual).toEqual(expected);
  });
});
