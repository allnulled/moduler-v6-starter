class Tracer {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TracerInterface,
    ], this);
  }
  static globalInstance = this.$ = Std.objects.GlobalTracer = this.new.config({ id: "main", isTracing: true, });
}