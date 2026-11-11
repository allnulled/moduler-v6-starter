module.exports = $moduler.import([
    "@/src/Std/console/AnsiColors/AnsiColors.class.js",
    "@/src/Std/error/ErrorFactory/ErrorFactory.class.js",
    "@/src/Std/error/ErrorHandler/ErrorHandler.class.js",
], function() {
  return $compiler.inject.source("./Isolate.class.js");
});