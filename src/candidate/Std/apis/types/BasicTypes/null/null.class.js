class Type_null {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TypeNullInterface = $compiler.inject.source("./TypeNullInterface.interface.js"),
    ], this);
  }
}