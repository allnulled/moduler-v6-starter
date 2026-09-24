function trifyAsync (callback, scope = undefined, inErrorReturn = undefined) {
  return async function (...args) {
    try {
      return await callback.call(scope, ...args);
    } catch (error) {
      return typeof inErrorReturn !== "undefined" ? inErrorReturn : error;
    }
  };
}