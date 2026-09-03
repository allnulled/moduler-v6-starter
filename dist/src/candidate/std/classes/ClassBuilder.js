    const reconstruir = function(...all) {
      const callback = function(...args) { this.constructor?.factories?.forEach(f => f.call(this, ...args)); };
      Array.from(all).reverse().forEach(it => {
        if(it.static) Object.assign(callback, it.static);
        if(it.instance) Object.assign(callback.prototype, it.instance);
        if(it.factory) (callback.factories = typeof callback.factories === "object" ? callback.factories : []).push(it.factory);
      });
      return callback;
    };