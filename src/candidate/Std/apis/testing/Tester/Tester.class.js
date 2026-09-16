class Tester {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.RunnableInterface,
      Std.interfaces.CheckerInterface,
      Std.interfaces.AsserterInterface,
      Std.interfaces.TesterInterface,
    ], this);
  }
}