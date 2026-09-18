class ObjectReflector {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      {
        static: {
          getAllProperties: $compiler.inject.source("./function.getAllProperties.js"),
        },
        prototype: {
          
        }
      }
    ], this);
  }
}