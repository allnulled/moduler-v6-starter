module.exports = $moduler.export("#Std.oop.Reflection", [], function () {
  return class OopReflection {
    static {
      Object.assign(this, {
        createClass: (callback, ...args) => {
          return this[
            callback instanceof async function () {}.constructor
              ? "createAsyncClass"
              : "createSyncClass"
          ](callback, ...args);
        },
        createSyncClass: function createSyncClass(callback, definition) {
          return Object.assign(
            function (...args) {
              const instanze = Object.create(definition, {});
              if (typeof callback === "function") {
                callback.call(instanze, ...args);
              }
              return instanze;
            },
            ...(definition?.constructor ? [definition.constructor] : []),
          );
        },
        createAsyncClass: function createAsyncClass(callback, definition) {
          return Object.assign(
            async function (...args) {
              const instanze = Object.create(definition, {});
              if (typeof callback === "function") {
                await callback.call(instanze, ...args);
              }
              return instanze;
            },
            ...(definition?.constructor ? [definition.constructor] : []),
          );
        },
      });
    }
  };
});
