class Thread {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.ThreadInterface,
    ], this);
    this.globalInstance = this.$ = Std.objects.GlobalThread = new Thread();
    Object.assign(this.globalInstance, {
      name: "Std.objects.GlobalThread",
      parent: false,
      children: [],
      isClosed: false,
    });
  }
}