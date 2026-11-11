class Thread {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.ThreadInterface,
    ], this);
    this.globalInstance = this.$ = Std.objects.GlobalThread = Thread.create({
      threadId: "Std.objects.GlobalThread",
      parent: false,
      children: [],
      isClosed: false,
    });
  }
}