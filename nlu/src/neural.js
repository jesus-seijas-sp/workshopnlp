// eslint-disable-next-line
const { Encoder } = require('./encoder');

// eslint-disable-next-line
const defaultLogFn = (status, time) =>
  console.log(`Epoch ${status.iterations} loss ${status.error} time ${time}ms`);

// eslint-disable-next-line
const runInputPerceptron = (weights, input) => {};

class Neural {
  // eslint-disable-next-line
  constructor(settings = {}) {}

  // eslint-disable-next-line
  prepareCorpus(corpus) {}

  // eslint-disable-next-line
  initialize(corpus) {}

  // eslint-disable-next-line
  trainPerceptron(perceptron, data) {}

  // eslint-disable-next-line
  train(corpus) {}

  // eslint-disable-next-line
  run(text) {}
}

module.exports = { Neural, runInputPerceptron };
