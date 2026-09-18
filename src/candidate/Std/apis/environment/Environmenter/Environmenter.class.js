class Environmenter {
  /**
   * 
   * # Std.classes.Environmenter
   * 
   * - Es una clase global no instanciable.
   * - Tiene 2 propiedades estáticas:
   *    - isBrowser:Boolean
   *    - isNodejs:Boolean
   * 
   */
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.EnvironmenterInterface,
    ], this);
  }
}