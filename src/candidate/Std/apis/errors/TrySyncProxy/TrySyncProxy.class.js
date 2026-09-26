class TrySyncProxy {

  constructor(target) {
    return new Proxy(target, {
      get(target, property) {
        const method = target[property];
        if (typeof method !== "function") {
          return method;
        }
        return (...args) => {
          try {
            return method.apply(target, args);
          } catch (error) {
            return error;
          }
        };
      },
    });
  }

}