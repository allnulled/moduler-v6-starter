class Asserter {
  static assert(condition, message) {
    if (!condition) throw new Error(message);
  }
  static assertDoesNotThrowSync(callback) {
    const isReversed = (typeof args[0] === "string") && (typeof args[1] === "function");
    const callback = isReversed ? args[1] : args[0];
    const message = isReversed ? args[0] : args[1];
    try {
      callback();
      this._notifyAssertion(message);
    } catch (err) {
      throw new this.constructor.AssertionError(`Should not have thrown (sync): ${err.name}: ${err.message}`, err);
    }
  }
  static async assertDoesNotThrowAsync(callback) {
    const isReversed = (typeof args[0] === "string") && (typeof args[1] === "function");
    const callback = isReversed ? args[1] : args[0];
    const message = isReversed ? args[0] : args[1];
    try {
      await callback();
      this._notifyAssertion(message);
    } catch (err) {
      throw new this.constructor.AssertionError(`Should not have thrown (async): ${err.name}: ${err.message}`, err);
    }
  }
}