_pick (parameters) {
  /**
   * # prototype._pick
   * - section: std.memory.SimpleRegistry.prototype._pick
   * - file:    @/src/candidate/std/memory/SimpleRegistry/prototype._pick.js
   */
  const { id, default: _default } = $moduler.toolkit.normalizeParameters(parameters, {
    id: {
      default: false,
      validate: it => typeof it === "string" ? true : `Parameter «id» must be string but «${typeof it}» was found instead on «SimpleRegistry.prototype._pick»`,
    },
    default: {
      default: undefined,
    }
  });
  return id in this.all ? this.all[id] : _default;
}