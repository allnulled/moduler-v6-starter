class Asserter {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.AsserterInterface,
    ], this);
  }
}