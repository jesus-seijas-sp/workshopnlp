const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const tokenize = (str) => str.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);

class Encoder {
  constructor(processor) {
    this.processor = processor || ((str) => tokenize(normalize(str)));
    this.featureMap = new Map();
    this.intentMap = new Map();
    this.numFeature = 0;
    this.intents = [];
  }

  learnIntent(intent) {
    if (!this.intentMap.has(intent)) {
      this.intentMap.set(intent, this.intents.length);
      this.intents.push(intent);
    }
  }

  learnFeature(feature) {
    if (!this.featureMap.has(feature)) {
      this.featureMap.set(feature, this.numFeature);
      this.numFeature += 1;
    }
  }

  encodeText(text, learn = false) {
    const dict = {};
    const result = [];
    const features = this.processor(text);
    features.forEach((feature) => {
      if (learn) {
        this.learnFeature(feature);
      }
      const index = this.featureMap.get(feature);
      if (index !== undefined && dict[index] === undefined) {
        dict[index] = true;
        result.push(index);
      }
    });
    return result;
  }

  encode(text, intent, learn = false) {
    if (learn) {
      this.learnIntent(intent);
    }
    return {
      input: this.encodeText(text, learn),
      output: this.intentMap.get(intent),
    };
  }

  encodeCorpus(corpus) {
    const result = { train: [], validation: [] };
    corpus.forEach(({ utterances, intent }) => {
      if (utterances) {
        utterances.forEach((utterance) => {
          const encoded = this.encode(utterance, intent, true);
          result.train.push(encoded);
        });
      }
    });
    corpus.forEach(({ tests, intent }) => {
      if (tests) {
        tests.forEach((test) => {
          const encoded = this.encode(test, intent);
          result.validation.push(encoded);
        });
      }
    });
    return result;
  }
}

module.exports = { normalize, tokenize, Encoder };
