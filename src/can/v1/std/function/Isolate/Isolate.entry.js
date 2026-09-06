module.exports = $moduler.import([
    "@/src/candidate/std/console/AnsiColors/AnsiColors.class.js",
    "@/src/candidate/std/error/ErrorFactory/ErrorFactory.class.js",
    "@/src/candidate/std/error/ErrorHandler/ErrorHandler.class.js",
], function() {
  return $compiler.inject.source("./Isolate.class.js");
});