module.exports = $moduler.import([
  "@/src/Std/console/AnsiColors/AnsiColors.class.js",
], function([ AnsiColors ]) {
  return $compiler.inject.source("./Factory.class.js");
});