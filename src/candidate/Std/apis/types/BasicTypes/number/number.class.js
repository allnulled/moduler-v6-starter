class Type_number {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeNumberInterface = $compiler.inject.source("./TypeNumberInterface.interface.js"),
    ], this);
  }
}