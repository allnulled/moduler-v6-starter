module.exports = $moduler.import([
  "@/dist/src/candidate/std/parser/JsonParser/JsonParser.dist.js",
], function([JsonParser]) {
  return $compiler.inject.source("./Dissector.class.js");
});