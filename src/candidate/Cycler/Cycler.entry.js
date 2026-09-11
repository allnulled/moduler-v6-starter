module.exports = $moduler.import([], function() {
  const DEBUG = console.log;
  const Newable = $compiler.inject.source("@/src/candidate/traits/Newable.class.js");
  return $compiler.inject.source("./Cycler.class.js");
});