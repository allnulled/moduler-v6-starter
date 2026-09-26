class TryAsyncProxy {

  constructor(target) {
    return new Proxy(target, {
      get(target, property) {
        const method = target[property];
        if (typeof method !== "function") {
          return method;
        }
        return async (...args) => {
          try {
            return await method.apply(target, args);
          } catch (error) {
            return error;
          }
        };
      },
    });
  }
  
}