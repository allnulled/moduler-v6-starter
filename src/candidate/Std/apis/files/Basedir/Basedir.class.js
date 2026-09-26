class Basedir {
  /*@injects:"./README.md"*/
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.BasedirInterface,
    ], this);
  }
}