module.exports = $moduler.import([], function () {
  return class Error {
    static Factory = Factory;
    static Handler = Handler;
    static Dissector = Dissector;
    static Prosecutor = Prosecutor;
  };
});
