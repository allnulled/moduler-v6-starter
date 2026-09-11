function triggerMethodIfExists(base, method, args = [], scope = false) {
  if(base && method in base) {
    if(scope) return base[method].call(scope, ...args);
    return base[method](...args);
  }
}