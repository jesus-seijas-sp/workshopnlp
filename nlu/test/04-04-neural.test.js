const { Neural } = require('../src');
const corpus = require('../data/small/corpus-en.json');

class Neural2 extends Neural {
  train(srcCorpus) {
    this.initialize(Array.isArray(srcCorpus) ? srcCorpus : srcCorpus.data);
    const data = this.encoded.train;
    const { maxIterations } = this.settings;
    while (this.status.iterations < maxIterations) {
      const hrstart = new Date();
      this.status.iterations += 1;
      this.status.error =
        this.perceptrons.reduce(
          (acc, perceptron) => acc + this.trainPerceptron(perceptron, data),
          0
        ) /
        (data.length * this.perceptrons.length);
      if (this.logFn) {
        const hrend = new Date();
        this.logFn(this.status, hrend.getTime() - hrstart.getTime());
      }
    }
    return this.status;
  }
}

describe('Neural', () => {
  describe('trainPerceptron', () => {
    it('Should train with the correct train and run', () => {
      const neural = new Neural2({ maxIterations: 10, log: false });
      const result = neural.train(corpus);
      expect(result.error).toBeLessThan(0.03);
      expect(result.iterations).toBe(10);
    });
  });
});
