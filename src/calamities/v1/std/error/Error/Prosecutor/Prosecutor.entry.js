module.exports = $moduler.import([
  "@/dist/src/candidate/std/parser/JsonParser/JsonParser.dist.js",
  "@/dist/src/candidate/std/error/Error/Factory/Factory.dist.js",
  "@/dist/src/candidate/std/error/Error/Handler/Handler.dist.js",
  "@/dist/src/candidate/std/error/Error/Dissector/Dissector.dist.js",
], function([JsonParser, ErrorFactory, ErrorHandler, ErrorDissector]) {
  return $compiler.inject.source("./Prosecutor.class.js");
});