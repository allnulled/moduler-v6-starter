function trify (callback, inErrorReturn = undefined, scope = false) {
  return function (...args) {
    try {
      const output = scope === false ? callback(...args) : callback.call(scope, ...args);
      return output instanceof Promise ? output.catch(error => error) : output;
    } catch (error) {
      return typeof inErrorReturn !== "undefined" ? inErrorReturn : error;
    }
  };
}