constructor (parameters = {}, settings = {}) {
  /**
   * # constructor
   * - section: std.memory.Registry.constructor
   * - file:    @/src/candidate/std/memory/Registry/constructor.js
   */
  const { all } = $moduler.toolkit.normalizeParameters(parameters, {
    all: {
      default: () => ({}),
      validate: it => typeof it === "object" || `Parameter «all» must be object but type «${typeof it}» was found instead on «SimpleRegistry.constructor»`,
    }
  });
  $compiler.inject.source("./this.all.js")
}