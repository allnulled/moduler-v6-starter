class DynamicProxy {
  static create(...args) {
    return new this(...args);
  }
  constructor(options) {
    $moduler.assert(typeof options === "object", `Required parameter «options» to be object on «DynamicProxy.constructor»`);
    $moduler.assert(typeof options.get === "function" || typeof options.set === "function", `Required parameter «options.get» or «option.set» to be function on «DynamicProxy.constructor»`);
    return new Proxy({}, {
      get: (target, property, receiver) => {
        if (typeof options.get === "function") {
          return options.get(property, receiver);
        }
      },
      set: (target, property, value, receiver) => {
        if (typeof options.set === "function") {
          return options.set(property, value, receiver);
        }
        return true;
      }
    });
  }
}