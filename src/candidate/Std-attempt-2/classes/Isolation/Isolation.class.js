class Isolation {
  static {
    Std.all.ClassSkiller.addInterfaces(this, [
      Std.all.CreableInterface,
      Std.all.ConfigurableInterface,
      Std.all.ClonableInterface,
      Std.all.RunnableInterface, {
        static: {
          catcher: Std.all.createIsolationCatcher,
        },
        prototype: {
          onRunStart: undefined,
          onRunSuccess: undefined,
          onRunCatch: Std.all.createIsolationCatcher("Isolation ${title} failed"),
          onRunEnd: undefined,
        }
      }
    ]);
  }
}