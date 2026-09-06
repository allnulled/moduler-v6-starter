module.exports = $moduler.import([], function() {
  const AnsiColors = $compiler.inject.source("@/src/candidate/std/console/AnsiColors/AnsiColors.class.js");
  const Timeout = $compiler.inject.source("@/src/candidate/std/time/Timeout/Timeout.class.js");
  const ErrorFactory = $compiler.inject.source("@/src/candidate/std/error/ErrorFactory/ErrorFactory.class.js");
  const ErrorHandler = $compiler.inject.source("@/src/candidate/std/error/ErrorHandler/ErrorHandler.class.js");
  const ErrorDissector = $compiler.inject.source("@/src/candidate/std/error/ErrorDissector/ErrorDissector.class.js");
  const Isolate = $compiler.inject.source("@/src/candidate/std/function/Isolate/Isolate.class.js");
  const Tracer = $compiler.inject.source("@/src/candidate/std/debug/Tracer/Tracer.class.js");
  return { ErrorFactory, ErrorHandler, Isolate, AnsiColors, Timeout, Tracer };
});