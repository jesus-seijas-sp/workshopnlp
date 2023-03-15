// eslint-disable-next-line
const { Encoder } = require('./encoder');

// eslint-disable-next-line
const defaultLogFn = (status, time) =>
  console.log(`Epoch ${status.iterations} loss ${status.error} time ${time}ms`);

const runInputPerceptron = (weights, input) => {
  const sum = input.reduce((acc, key) => acc + weights[key], 0);
  return sum <= 0 ? 0 : sum;
};

class Neural {
  constructor(settings = {}) {
    this.settings = settings;
    this.settings.learningRate ??= 0.002;
    this.settings.maxIterations ??= 150;
  }

  prepareCorpus(corpus) {
    this.encoder =
      this.settings.encoder || new Encoder(this.settings.processor);
    this.encoded = this.encoder.encodeCorpus(corpus);
  }

  initialize(corpus) {
    this.prepareCorpus(corpus);
    this.status = { error: Infinity, iterations: 0 };
    this.perceptrons = this.encoder.intents.map((intent) => ({
      intent,
      id: this.encoder.intentMap.get(intent),
      weights: new Float32Array(this.encoder.numFeature),
    }));
  }

  trainPerceptron(perceptron, data) {
    const { weights } = perceptron;
    const { learningRate } = this.settings;
    let error = 0;
    data.forEach(({ input, output }) => {
      const expectedOutput = output === perceptron.id ? 1 : 0;
      const currentOutput = runInputPerceptron(weights, input);
      const currentError = expectedOutput - currentOutput;
      if (currentError) {
        error += currentError ** 2;
        const change = currentError * learningRate;
        input.forEach((key) => {
          weights[key] += change;
        });
      }
    });
    return error;
  }

  train(corpus) {
    this.initialize(Array.isArray(corpus) ? corpus : corpus.data);
    const data = this.encoded.train;
    const { maxIterations } = this.settings;
    while (this.status.iterations < maxIterations) {
      //const hrstart = new Date();
      this.status.iterations += 1;
      let error = 0;
      this.perceptrons.forEach((perceptron) => {
        error += this.trainPerceptron(perceptron, data);
      });
      this.status.error = error / (data.length * this.perceptrons.length);
      // const hrend = new Date();
      // defaultLogFn(this.status, hrend.getTime() - hrstart.getTime());
    }
    return this.status;
  }

  run(text) {
    const input = this.encoder.encodeText(text);
    const result = this.perceptrons.reduce((acc, { weights, intent }) => {
      const score = runInputPerceptron(weights, input);
      if (score > 0) {
        acc.push({ intent, score });
      }
      return acc;
    }, []);
    if (!result.length) {
      return [{ intent: 'None', score: 1 }];
    }
    return result.sort((a, b) => b.score - a.score);
  }
}

module.exports = { Neural, runInputPerceptron };
