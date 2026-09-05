_find({ filter }) {
  /**
   * # prototype._find
   * - section: std.memory.Registry.prototype._find
   * - file:    @/src/candidate/std/memory/Registry/prototype._find.js
   */
  let matchedKeys = [], output = {};
  if (typeof filter === "undefined") {
    // 1. Establece output a todos en undefined
    output = this.all;
  } else if (typeof filter === "function") {
    // 2. Establece output a algunos en function
    matchedKeys = Object.keys(this.all).filter((key, index) => {
      return filter(this.all[key], key, index, matchedKeys, this.all);
    });
    // 2.1. Reconstruye el objeto con las propiedades matcheadas
    for (let index = 0; index < matchedKeys.length; index++) {
      const key = matchedKeys[index];
      output[key] = this.all[key];
    }
  } else if (typeof filter === "string") {
    return { [filter]: this._pick({ id: filter }) };
  } else {
    // 3. Lanza error en los demás casos
    throw new Error(`Parameter «filter» must be undefined or function but not «${typeof filter}» on «SimpleRegistry.prototype._find»`);
  }
  // 4. Devuelve output
  return output;
}