function measure(net, corpus) {
  let total = 0;
  let good = 0;
  corpus.data.forEach((item) => {
    item.tests.forEach((test) => {
      const output = net.run(test);
      total += 1;
      const intent = Array.isArray(output) ? output[0].intent : output.intent;
      if (intent === item.intent) {
        good += 1;
      }
    });
  });
  return { good, total };
}

module.exports = { measure };
