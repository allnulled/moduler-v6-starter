_modify (parameters) {
  /**
   * # prototype._modify
   * - section: std.memory.SimpleRegistry.prototype._modify
   * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype._modify.js
   */
  const { filter, modifier } = $moduler.toolkit.normalizeParameters(parameters, {
    filter: {
      validate: it => ["function","string","undefined"].includes(typeof it) || "Parameter «filter» must be function, string or undefined on «SimpleRegistry.prototype._modify»",
    },
    modifier: {
      validate: it => typeof it === "function" || "Parameter «modifier» must be function on «SimpleRegistry.prototype._modify»",
    },
  });
  let matches;
  let counter = 0;
  Find_matches: {
    matches = this._find({ filter });
  }
  Iterate_matches:
  for(const key in matches) {
    const val = matches[key];
    const result = modifier(val, key, counter);
    Delete_or_override:
    if(typeof result === "undefined") {
      delete this.all[key];
    } else {
      this.all[key] = result;
    }
    counter++;
  }
  return Object.keys(matches);
}