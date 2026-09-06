module.exports = $moduler.import([
    "@/dist/src/candidate/std/console/AnsiColors/AnsiColors.dist.js",
    "@/dist/src/candidate/std/error/Error/Factory/Factory.dist.js",
], function([ AnsiColors, ErrorFactory ]) {
  return $compiler.inject.source("./Handler.class.js");
});