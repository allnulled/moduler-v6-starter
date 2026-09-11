class Environmenter {
  static isBrowser = typeof window !== "undefined";
  static isNodejs = typeof global !== "undefined";
  static throw(message) {
    throw Error.create({ name: "EnvironmentalError", message });
  }
}