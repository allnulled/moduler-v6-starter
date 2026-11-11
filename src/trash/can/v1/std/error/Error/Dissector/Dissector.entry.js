module.exports = $moduler.import([
  "@/dist/src/Std/parser/JsonParser/JsonParser.dist.js",
], function([JsonParser]) {
  return $compiler.inject.source("./Dissector.class.js");
});