_define ({ key, value }) {
  /**
   * # prototype._set
   * - section: std.memory.Registry.prototype._set
   * - file:    @/src/candidate/std/memory/Registry/prototype._set.js
   */
  if(key in this.all) {
    throw new Error(`Method «SimpleRegistry.prototype._define» is not allowed to override the value of key «${key}»`);
  }
  this.all[key] = value;
}