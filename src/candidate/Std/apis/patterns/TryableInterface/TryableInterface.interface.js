{
  prototype: {
    get try() {
      return new Std.classes.TryableProxy(this);
    }
  }
}