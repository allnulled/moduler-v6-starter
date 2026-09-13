{
  clone: function(newConfig = {}) {
    return this.constructor.new.config(Object.assign(newConfig, this));
  }
}