class EventsBox {
  static create(...args) {
    return new this(...args);
  }
  constructor() {
    this.registry = {};
  }
  add(name, listener, props = null) {
    (this.registry[name] = this.registry[name] || []).push({ listener, props });
  }
  remove(name, listener) {
    if(!this.registry[name]) return -2;
    const pos = this.registry[name].findIndex(it => it.listener === listener);
    if(pos === -1) return -3;
    this.registry[name].splice(pos, 1);
    return pos;
  }
  run(name, input = {}) {
    if(!this.registry[name]) return -2;
    return this.registry[name].map(({ listener, props }, index) => {
      const output = listener({ input, props, index });
      if(props.once === true) {
        this.registry[name].splice(index, 1);
      }
      return output;
    });
  }
}