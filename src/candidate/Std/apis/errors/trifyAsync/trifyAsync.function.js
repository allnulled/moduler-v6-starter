function trifyAsync (callback, inErrorReturn = undefined) {
  return async function (...args) {
    try {
      return await callback(...args);
    } catch (error) {
      return typeof inErrorReturn !== "undefined" ? inErrorReturn : error;
    }
  };
}