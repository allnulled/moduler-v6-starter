_delete ({ filter }) {
  /**
   * # prototype._delete
   * - section: std.memory.Registry.prototype._delete
   * - file:    @/src/candidate/std/memory/Registry/prototype._delete.js
   */
  const matches = this._find({ filter });
  Remove_matches:
  for(const key in matches) {
    delete this.all[key];
  }
  return Object.keys(matches);
}