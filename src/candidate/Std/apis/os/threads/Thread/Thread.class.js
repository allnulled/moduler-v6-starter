class Thread {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.ThreadInterface,
    ], this);
  }
  static globalInstance = this.$ = Std.objects.GlobalThread = new Thread();
}