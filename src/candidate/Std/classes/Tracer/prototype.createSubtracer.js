createSubtracer (configuration = {}) {
  return this.constructor.new.config(Object.assign({}, this, configuration));
}