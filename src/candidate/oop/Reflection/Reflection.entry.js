module.exports = $moduler.export("#Std.oop.Reflection", [], function() {
  return class OopReflection {
    static {
      Object.assign(this, {
        createClass: $compiler.inject.source("./static.createClass.js"),
        createSyncClass: $compiler.inject.source("./static.createSyncClass.js"),
        createAsyncClass: $compiler.inject.source("./static.createAsyncClass.js"),
      });
    }
  };
});