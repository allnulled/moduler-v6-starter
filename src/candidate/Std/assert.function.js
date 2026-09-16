function assert(condition, message = "assertion error (no details specified)") {
  if(!condition) throw Error.normalize(message).adding({name: "AssertionError", message: "Some assertion failed" });
}