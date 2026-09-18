class Type_function {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeFunctionInterface = $compiler.inject.source("./TypeFunctionInterface.interface.js"),
    ], this);
  }
}