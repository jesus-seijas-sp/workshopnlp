const { Neural } = require('../src');
const corpus = require('../data/small/corpus-en.json');
const encoded = require('./encoded-en.json');

describe('Neural', () => {
  describe('initialize', () => {
    it('Should call prepareCorpus', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.encoded).toEqual(encoded);
    });
    it('Should initialize status', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.status).toEqual({ error: Infinity, iterations: 0 });
    });
    it('Should initialize perceptrons with as many perceptrons as intents', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.perceptrons).toHaveLength(50);
    });
    it('Each perceptron should have the name of the intent', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.perceptrons[0].intent).toEqual('support.about');
      expect(net.perceptrons[1].intent).toEqual('support.app_name');
    });
    it('Each perceptron should have the id of the intent', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.perceptrons[0].id).toEqual(0);
      expect(net.perceptrons[1].id).toEqual(1);
    });
    it('Each perceptron should have a weights array with the same length as the number of features', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      expect(net.perceptrons[0].weights).toBeInstanceOf(Float32Array);
      expect(net.perceptrons[0].weights).toHaveLength(277);
      expect(net.perceptrons[1].weights).toHaveLength(277);
    });
  });
});
