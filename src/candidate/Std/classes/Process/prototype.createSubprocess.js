function createSubprocess (configurations = {}) {
  return this.constructor.new.config({ ...configurations, ppid: this.pid });
}