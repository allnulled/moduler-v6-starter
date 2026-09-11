function simplestAssert(condition, message = "Assertion failed") {
  if(!condition) throw Error.create(message);
}