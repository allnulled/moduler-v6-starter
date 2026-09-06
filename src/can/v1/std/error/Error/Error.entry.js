module.exports = $moduler.import([
  "@/dist/src/candidate/std/error/Error/Factory/Factory.dist.js",
  "@/dist/src/candidate/std/error/Error/Handler/Handler.dist.js",
  "@/dist/src/candidate/std/error/Error/Dissector/Dissector.dist.js",
  "@/dist/src/candidate/std/parser/JsonParser/Prosecutor.dist.js",
], function([Factory, Handler, Dissector, Prosecutor]) {
  return $compiler.inject.source("./Error.class.js");
});