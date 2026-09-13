class Asserter {
  static assert(condition, message) {
    if(!condition) throw new Error(message);
  }
}