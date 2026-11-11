module.exports = $moduler.import([
    "@/dist/src/Std/console/AnsiColors/AnsiColors.dist.js",
    "@/dist/src/Std/error/Error/Factory/Factory.dist.js",
], function([ AnsiColors, ErrorFactory ]) {
  return $compiler.inject.source("./Handler.class.js");
});