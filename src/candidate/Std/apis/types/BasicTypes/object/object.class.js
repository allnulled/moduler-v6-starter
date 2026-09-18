class Type_object {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeObjectInterface = $compiler.inject.source("./TypeObjectInterface.interface.js"),
    ], this);
  }
}