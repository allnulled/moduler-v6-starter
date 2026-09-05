module.exports = $moduler.import([
  "@/src/candidate/std/console/AnsiColors/AnsiColors.class.js",
], function([ AnsiColors ]) {
  return $compiler.inject.source("./Factory.class.js");
});