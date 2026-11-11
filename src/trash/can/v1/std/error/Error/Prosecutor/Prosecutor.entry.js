module.exports = $moduler.import([
  "@/dist/src/Std/parser/JsonParser/JsonParser.dist.js",
  "@/dist/src/Std/error/Error/Factory/Factory.dist.js",
  "@/dist/src/Std/error/Error/Handler/Handler.dist.js",
  "@/dist/src/Std/error/Error/Dissector/Dissector.dist.js",
], function([JsonParser, ErrorFactory, ErrorHandler, ErrorDissector]) {
  return $compiler.inject.source("./Prosecutor.class.js");
});