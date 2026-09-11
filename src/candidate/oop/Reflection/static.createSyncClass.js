function createSyncClass (callback, definition) {
  return Object.assign(function (...args) {
    const instanze = Object.create(definition, {});
    if (typeof callback === "function") {
      callback.call(instanze, ...args);
    };
    return instanze;
  }, ...(definition?.constructor ? [definition.constructor] : []));
}