const { Neural, runInputPerceptron, measure } = require('../src');
const corpus = require('../data/small/corpus-en.json');

class Neural2 extends Neural {
  run(text) {
    const result = this.perceptrons
      .map(({ intent, weights }) => ({
        intent,
        score: runInputPerceptron(weights, this.encoder.encodeText(text)),
      }))
      .filter((x) => x.score > 0);
    if (!result.length) {
      return [{ intent: 'None', score: 1 }];
    }
    return result.sort((a, b) => b.score - a.score);
  }
}

describe('Neural', () => {
  describe('train', () => {
    it('Should train and give an "ok" accuracy', () => {
      const neural = new Neural2({ log: false });
      neural.train(corpus);
      const result = measure(neural, corpus);
      expect(result.good / result.total).toBeGreaterThan(0.7);
    });
  });
});
