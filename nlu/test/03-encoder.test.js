const { normalize, tokenize, Encoder } = require('../src');
const corpus = require('../data/small/corpus-en.json');
const encodedCorpus = require('./encoded-en.json');

const processor = (text) =>
  tokenize(
    normalize(text)
      .map((x) => x.slice(0, -1))
      .filter((x) => x)
  );

describe('Encoder', () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      const encoder = new Encoder();
      expect(encoder).toBeInstanceOf(Encoder);
    });
    it('A processor function can be provided', () => {
      const encoder = new Encoder(processor);
      expect(encoder.processor).toBe(processor);
    });
  });

  describe('encodeText', () => {
    it('Should return an empty array if the text is empty', () => {
      const encoder = new Encoder();
      expect(encoder.encodeText('')).toEqual([]);
    });
    it('Should train the features to an intent if train mode is on', () => {
      const encoder = new Encoder();
      const actual = encoder.encodeText('This is a test', true);
      expect(actual).toEqual([0, 1, 2, 3]);
    });
    it('Should return features index of existing features', () => {
      const encoder = new Encoder();
      encoder.encodeText('This is a test', true);
      const actual = encoder.encodeText('test is a this');
      expect(actual).toEqual([3, 1, 2, 0]);
    });
    it('Should not return indexes for non existing features', () => {
      const encoder = new Encoder();
      encoder.encodeText('This is a test', true);
      const actual = encoder.encodeText('test is a something');
      expect(actual).toEqual([3, 1, 2]);
    });
    it('Should return features index of existing features without repetitions', () => {
      const encoder = new Encoder();
      encoder.encodeText('This is a test', true);
      const actual = encoder.encodeText(
        'test is a this test is a this test is a this'
      );
      expect(actual).toEqual([3, 1, 2, 0]);
    });
  });

  describe('encode', () => {
    test('It can encode embeddings of a sentence and intent', () => {
      const encoder = new Encoder();
      encoder.encode('This is a test', 'intent-test', true);
      const actual = encoder.encode('This is a test', 'intent-test');
      expect(actual).toEqual({
        input: [0, 1, 2, 3],
        output: 0,
      });
    });
  });

  describe('encodeCorpus', () => {
    it('Can encode a corpus', () => {
      const encoder = new Encoder();
      const actual = encoder.encodeCorpus(corpus.data);
      expect(actual).toEqual(encodedCorpus);
    });
    it('Can encode intents without tests', () => {
      const encoder = new Encoder();
      const smallCorpus = [
        {
          intent: 'intent',
          utterances: ['This is a utterance'],
        },
      ];
      const expected = {
        train: [
          {
            input: [0, 1, 2, 3],
            output: 0,
          },
        ],
        validation: [],
      };
      const actual = encoder.encodeCorpus(smallCorpus);
      expect(actual).toEqual(expected);
    });
  });
});
