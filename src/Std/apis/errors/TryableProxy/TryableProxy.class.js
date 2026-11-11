class TryableProxy {

  constructor(target) {
    return new Proxy(target, {
      get(target, property) {
        const method = target[property];
        if (typeof method !== "function") {
          return method;
        }
        return (...args) => {
          try {
            const output = target[property](...args);
            return output instanceof Promise ? output.catch(error => error) : output;
          } catch (error) {
            return error;
          }
        };
      },
    });
  }

}