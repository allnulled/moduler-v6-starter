{
  prototype: {
    get try() {
      return new Std.classes.TrySyncProxy(this);
    },
    get asyncTry() {
      return new Std.classes.TryAsyncProxy(this);
    }
  }
}