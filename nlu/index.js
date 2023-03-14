const { Bench, Neural, measure, normalize } = require('./src');
const corpusSmallEn = require('./data/small/corpus-en.json');
const corpusSmallEs = require('./data/small/corpus-es.json');
const corpusSmallJa = require('./data/small/corpus-ja.json');
const corpusMassiveEn = require('./data/massive/corpus-massive-en.json');
const corpusMassiveEs = require('./data/massive/corpus-massive-es.json');
const corpusMassiveJa = require('./data/massive/corpus-massive-ja.json');

const tokenizeChar = (text) => text.split('');
const processorJa = (text) => tokenizeChar(normalize(text));

const languages = [
  {
    name: 'English',
    corpusSmall: corpusSmallEn,
    corpusMassive: corpusMassiveEn,
  },
  {
    name: 'Spanish',
    corpusSmall: corpusSmallEs,
    corpusMassive: corpusMassiveEs,
  },
  {
    name: 'Japanese',
    corpusSmall: corpusSmallJa,
    corpusMassive: corpusMassiveJa,
    processor: processorJa,
  },
];

function execFn({ net, data }) {
  let good = 0;
  data.forEach((item) => {
    const classifications = net.run(item.utterance);
    if (classifications[0].intent === item.intent) {
      good += 1;
    }
  });
  return { good, total: data.length };
}

async function trainAndValidate(corpus, processor) {
  const hrstart = process.hrtime();
  const net = new Neural({ processor });
  net.train(corpus);
  const results = measure(net, corpus);
  const accuracy = (results.good * 100) / results.total;
  console.log(`Accuracy: ${accuracy}`);
  const hrend = process.hrtime(hrstart);
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

  const testData = [];
  corpus.data.forEach((item) => {
    item.tests.forEach((test) => {
      testData.push({ utterance: test, intent: item.intent });
    });
  });
  const bench = new Bench({ transactionsPerRun: testData.length });
  const benchResult = bench.measure(execFn, () => ({ net, data: testData }));
  console.log(`Transactions per second: ${benchResult}`);
}

console.log('Small dataset');
console.log('=============');
for (let i = 0; i < languages.length; i += 1) {
  const language = languages[i];
  const { corpusSmall } = language;
  console.log(language.name);
  trainAndValidate(corpusSmall, language.processor);
}
console.log('\nMassive dataset');
console.log('===============');
for (let i = 0; i < languages.length; i += 1) {
  const language = languages[i];
  const { corpusMassive } = language;
  console.log(language.name);
  trainAndValidate(corpusMassive, language.processor);
}
