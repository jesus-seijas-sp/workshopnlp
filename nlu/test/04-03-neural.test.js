const { Neural, runInputPerceptron } = require('../src');
const corpus = require('../data/small/corpus-en.json');

describe('Neural', () => {
  describe('runInputPerceptron', () => {
    it('Should sum weights based on input', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      for (let i = 0; i < 278; i += 1) {
        net.perceptrons[0].weights[i] = i;
      }
      const actual = runInputPerceptron(
        net.perceptrons[0].weights,
        [2, 8, 10, 100]
      );
      expect(actual).toBe(120);
    });
    it('Should return 0 if sum is less than 0', () => {
      const net = new Neural();
      net.initialize(corpus.data);
      for (let i = 0; i < 278; i += 1) {
        net.perceptrons[0].weights[i] = -i;
      }
      const actual = runInputPerceptron(
        net.perceptrons[0].weights,
        [2, 8, 10, 100]
      );
      expect(actual).toBe(0);
    });
  });
});
