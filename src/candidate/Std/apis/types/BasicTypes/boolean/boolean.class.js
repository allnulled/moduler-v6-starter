class Type_boolean {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeBooleanInterface = $compiler.inject.source("./TypeBooleanInterface.interface.js"),
    ], this);
  }
}