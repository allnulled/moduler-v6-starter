module.exports = $moduler.import([], function() {
  const AnsiColors = $compiler.inject.source("@/src/Std/console/AnsiColors/AnsiColors.class.js");
  const Timeout = $compiler.inject.source("@/src/Std/time/Timeout/Timeout.class.js");
  const ErrorFactory = $compiler.inject.source("@/src/Std/error/ErrorFactory/ErrorFactory.class.js");
  const ErrorHandler = $compiler.inject.source("@/src/Std/error/ErrorHandler/ErrorHandler.class.js");
  const ErrorDissector = $compiler.inject.source("@/src/Std/error/ErrorDissector/ErrorDissector.class.js");
  const Isolate = $compiler.inject.source("@/src/Std/function/Isolate/Isolate.class.js");
  const Tracer = $compiler.inject.source("@/src/Std/debug/Tracer/Tracer.class.js");
  return { ErrorFactory, ErrorHandler, Isolate, AnsiColors, Timeout, Tracer };
});