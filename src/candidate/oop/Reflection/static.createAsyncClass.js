function createAsyncClass(callback, definition) {
  return Object.assign(async function (...args) {
    const instanze = Object.create(definition, {});
    if (typeof callback === "function") {
      await callback.call(instanze, ...args);
    };
    return instanze;
  }, ...(definition?.constructor ? [definition.constructor] : []));
}