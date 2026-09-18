class Type_array {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeArrayInterface = $compiler.inject.source("./TypeArrayInterface.interface.js"),
    ], this);
  }
}