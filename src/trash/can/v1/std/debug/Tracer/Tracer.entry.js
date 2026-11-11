module.exports = $moduler.import([
    "@/src/Std/console/AnsiColors/AnsiColors.class.js",
    "@/src/Std/error/ErrorFactory/ErrorFactory.class.js",
    "@/src/Std/error/ErrorHandler/ErrorHandler.class.js",
    "@/src/Std/function/Isolate/Isolate.class.js",
], function([ AnsiColors, ErrorFactory, ErrorHandler, Isolate ]) {
  return $compiler.inject.source("./Tracer.class.js");
});