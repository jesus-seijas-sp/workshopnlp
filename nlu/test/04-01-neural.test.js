const { Neural } = require('../src');
const { Encoder } = require('../src');
const corpus = require('../data/small/corpus-en.json');
const encoded = require('./encoded-en.json');

describe('Neural', () => {
  describe('prepareCorpus', () => {
    test('If an encoder is provided in the settings, the encoder of the instance must be the same', () => {
      const encoder = new Encoder();
      const net = new Neural({ encoder });
      net.prepareCorpus(corpus.data);
      expect(net.encoder).toBe(encoder);
    });
    test('If no encoder is provided, it must create a new one', () => {
      const net = new Neural();
      net.prepareCorpus(corpus.data);
      expect(net.encoder).toBeInstanceOf(Encoder);
    });
    test('It must encode the corpus', () => {
      const net = new Neural();
      net.prepareCorpus(corpus.data);
      expect(net.encoded).toEqual(encoded);
    });
  });
});
