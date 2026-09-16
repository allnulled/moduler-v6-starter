class Tracer {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TracerInterface,
    ], this);
  }
  static globalInstance = this.new.config({ id: "main", isTracing: true, });
}