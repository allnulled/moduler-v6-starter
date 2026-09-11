{
  // Interface SOLO ACEPTA 2 propiedades:
  static: Std.all.mixProperties({
    // Static members:
    create: Std.all.Creable.create,
  }, [
    // Static accessors:
    Std.all.Newable
  ]),
  prototype: Std.all.mixProperties({
    // Prototype members:
    clone: Std.all.Clonable.clone,
    config: Std.all.Configurable.config,
  }, [
    // Prototype accessors:
  ]),
}