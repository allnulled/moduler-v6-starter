class Isolation {
  static {
    //Std.all.mixProperties(this, )
    // CURRECTA:
    //*
    Borrowed_interfaces: {
      // Statics:
      Std.all.ClassSkiller.addStatic(this, Std.all.EmptyConstructor.static);
      // Prototypes:
      Std.all.ClassSkiller.addPrototype(this, Std.all.EmptyConstructor.prototype);
      Std.all.ClassSkiller.addPrototype(this, Std.all.Runnable);
    }
    Custom_interfaces: {
      // Custom interfaces:
      Std.all.ClassSkiller.addStatic(this, {catcher: Std.all.createIsolationCatcher});
      Std.all.ClassSkiller.addPrototype(this, {
        onRunStart: undefined,
        onRunSuccess: undefined,
        onRunCatch: this.catcher("Isolation ${title} failed"),
        onRunEnd: undefined,
      });
    }
    //*/
  }
}