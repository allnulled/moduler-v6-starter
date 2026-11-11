module.exports = $moduler.import([
  "@/dist/src/Std/error/Error/Factory/Factory.dist.js",
  "@/dist/src/Std/error/Error/Handler/Handler.dist.js",
  "@/dist/src/Std/error/Error/Dissector/Dissector.dist.js",
  "@/dist/src/Std/parser/JsonParser/Prosecutor.dist.js",
], function([Factory, Handler, Dissector, Prosecutor]) {
  return $compiler.inject.source("./Error.class.js");
});