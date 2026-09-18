class Type_string {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeStringInterface = $compiler.inject.source("./TypeStringInterface.interface.js"),
    ], this);
  }
}