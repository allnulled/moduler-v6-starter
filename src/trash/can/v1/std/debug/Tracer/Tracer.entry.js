module.exports = $moduler.import([
    "@/src/candidate/std/console/AnsiColors/AnsiColors.class.js",
    "@/src/candidate/std/error/ErrorFactory/ErrorFactory.class.js",
    "@/src/candidate/std/error/ErrorHandler/ErrorHandler.class.js",
    "@/src/candidate/std/function/Isolate/Isolate.class.js",
], function([ AnsiColors, ErrorFactory, ErrorHandler, Isolate ]) {
  return $compiler.inject.source("./Tracer.class.js");
});