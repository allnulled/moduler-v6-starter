static rethrow(error) {
  return ErrorHandler.pick(error).rethrow();
}