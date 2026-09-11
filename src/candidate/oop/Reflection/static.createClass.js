(callback, ...args) => {
  return this[callback instanceof (async function() {}).constructor ? "createAsyncClass" : "createSyncClass"](callback, ...args);
}