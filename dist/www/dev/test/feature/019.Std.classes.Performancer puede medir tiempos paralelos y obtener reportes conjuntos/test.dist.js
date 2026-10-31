module.exports = async function ({ Tester }) {

  const { Performancer, Timeout } = Std.all;

  Performancer.$.start("evento 1");
  await Timeout.of(5);
  Performancer.$.start("evento 1 | etapa 1");
  await Timeout.of(10);
  Performancer.$.stop("evento 1 | etapa 1");
  Performancer.$.start("evento 1 | etapa 2");
  await Timeout.of(20);
  Performancer.$.stop("evento 1 | etapa 2");
  Performancer.$.start("evento 1 | etapa 3");
  await Timeout.of(30);
  Performancer.$.stop("evento 1 | etapa 3");
  await Timeout.of(5);
  Performancer.$.stop("evento 1");

  Performancer.$.print();

};